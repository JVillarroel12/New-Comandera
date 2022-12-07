import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-modal-transladar-cuenta',
  templateUrl: './modal-transladar-cuenta.page.html',
  styleUrls: ['./modal-transladar-cuenta.page.scss'],
})
export class ModalTransladarCuentaPage implements OnInit {

  dataComanda = [];
  mesas = [];
  zonas = [];
  active:any;
  cuentasSaliendo: any;
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public apiService: ApiServiceService,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public toastr:ToastController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public location: Location,
    public router: Router
  ) { 
    this.tema = localStorage.getItem('cambiarTema');
    this.dataComanda.length = 0;
    this.apiService.$getTransladarCuenta.subscribe(data=>{
      if(data.length > 1){
        data.forEach(res=>{
          this.dataComanda.push(res['cuenta_id'])
        })
        
      }else{
         this.dataComanda.push(data['cuenta_id'])
          
      }

    });

  }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10,() => {

      if(this.location.isCurrentPathEqualTo('/modal-transladar-cuenta')){
        this.modalCtrl.dismiss();
      }
      this.modalCtrl.dismiss();
  }); 
  }
  async ionViewWillEnter(){

      /** CODIGO PARA OBTENER LAS ZONAS**/
      const loading = await this.loadingCtrl.create({
        message: 'Cargando...',
        cssClass: 'spinner'
      });
      loading.present();
      this.apiService.getAllZonas().subscribe(data=>{
        //console.log(data);
        this.zonas = data;
  
        loading.dismiss()
      },(error)=>{
        console.log('error',error.error);
        if(error.error['logout'] == true){
          this.router.navigate(['/login']);
          this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
        }else{
          this.toast('Ha ocurrido un error', 'danger');
        }
        if(error.error == 'Se acabo el tiempo de espera'){
          this.toast('Ha ocurrido un error al cargar', 'danger')
        }
        
        loading.dismiss();
      })

  }
    /** FUNCION PARA MOSTRAR LAS MESAS AL HACER CLICK EN UNA ZONA**/
    mostrarMesas(zona, _data) {
      console.log(zona);
      console.log("ZONA =>",zona);
      //this.ApiService.actualizarMesas = zona['zona_id'];
      //console.log("mesas",_data);
      this.mesas = _data;
      this.active = zona['zona_id'];
    }
  async seleccionarMesa(data){
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner'
    });
    loading.present();
    console.log(data);
      let trasladarCuenta = {
        cuentas: this.dataComanda,
        mesa_id: data.mesa_id
      }
      console.log("LO QUE SE VA A ENVIAR ==>", trasladarCuenta);
      
      this.http.post(this.apiService.transladarCuenta, trasladarCuenta).subscribe(res=>{
        console.log(res);
        /**CERRAR MODAL Y OBTENER LAS CUENTAS */
        this.http.get(this.apiService.getMesa + data.mesa_id).subscribe((response)=>{
            this.cuentasSaliendo = response['cuentas']
            console.log("saliendo cuentas",this.cuentasSaliendo);
            
            this.modalCtrl.dismiss({
              dataTraslado: this.cuentasSaliendo
            });
              loading.dismiss();
              this.toast('Cuentas trasladadas con exito', 'success')
        })
       
      },(error)=>{
        console.log(error);
        loading.dismiss();
        if(error.error['logout'] == true){
          this.router.navigate(['/login']);
          this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
        }else{
          this.toast('Ha ocurrido un error', 'danger');
        }
      });
    
    
  }

  cerralModal(){  
    this.modalCtrl.dismiss();
  }
  /** CERRAR SESION**/
 
  async toast(msg, status){
    const toast = await this.toastr.create({
      message:msg,
      position:'top',
      color: status,
      duration: 3000,
      cssClass:"toastCss"
    });
    toast.present();
  }
}