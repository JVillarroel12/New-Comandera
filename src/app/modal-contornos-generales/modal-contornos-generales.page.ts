import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../services/api-service.service';
import { Location } from '@angular/common';
export interface Comanda{
  category_id: number
  cuenta_id: number
  deposito_id: number
  discount: number
  estacion_id:number
  iva: number
  name: string
  price: string
  pricebase: number
  product_id: number
  qty: number
  user_id: string
  contornos: any;
}
export interface Contorno{
  contorno_id:number ,
  grupo_id: number
​​  name: string
​​  qty: number
}
@Component({
  selector: 'app-modal-contornos-generales',
  templateUrl: './modal-contornos-generales.page.html',
  styleUrls: ['./modal-contornos-generales.page.scss'],
})

export class ModalContornosGeneralesPage implements OnInit {

  @Input() comandaModal;
  grupoContornos = [];
  contornosAgregados = [];
  contornos = [];
  enviarContornos = [];
  contornosEliminados = [];
  comanda: any;

  textoBuscar = '';
  search = '';
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public modalCtrl: ModalController,
    public apiService: ApiServiceService,
    public alertCtrl: AlertController,
    public toastr: ToastController,
    public loadingController: LoadingController,
    public platform: Platform,
    public location: Location
  ) { 
    this.tema = localStorage.getItem('cambiarTema');
  }

  async ngOnInit() {
    console.log("llegando COmanda",this.comandaModal);
    
    this.platform.backButton.subscribeWithPriority(10,() => {

      if(this.location.isCurrentPathEqualTo('/modal-contornos-generales')){
        this.modalCtrl.dismiss();
      }
      this.modalCtrl.dismiss();
  }); 


  this.getAllContornos();
  }

  async getAllContornos(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner'
    })
    loading.present();

    this.apiService.getContornos().subscribe(data=>{
      
      this.grupoContornos = data;

      console.log("CONTORNOS GENERALES", this.grupoContornos);
      
      loading.dismiss();
  },(error)=>{
    console.log(error.error);
    
    this.toast("Error obteniendo los contornos", "danger")
    loading.dismiss()
  });
  
    this.contornosAgregados = JSON.parse(JSON.stringify(this.comandaModal['contorno_comandas']));
  }
  seleccionarContorno(contorno:Contorno){

    this.contornosAgregados.push(contorno);

    console.log(this.contornosAgregados);
    
  }
  abrirContorno(_data){
    this.contornos = _data['contornos']
  }
  buscador(_event){
    console.log("EVENTOO",_event.detail.value);
    
    if(_event.detail.value == ''){
      console.log("HOLAAA");
      
      this.contornos.length = 0;
    }
  }
  guardarContornos(_aux){
   
    
    let comanda:Comanda; 
    comanda = this.comanda
    if(_aux){
      console.log(comanda);
      if(this.contornosAgregados.length >= 1 ){
      this.contornosAgregados.forEach(res=>{
  
        this.enviarContornos.push(res)
        console.log("enviando...",this.enviarContornos);
        
        this.modalCtrl.dismiss({
          data: this.enviarContornos,
          aux: 'si',
          contornos: 'si'
        });
      })
    }else{
      this.modalCtrl.dismiss({
        data: this.enviarContornos,
        aux: 'si',
        contornos: 'si'
      });
      }
    }else{
      this.modalCtrl.dismiss({
        data: this.enviarContornos.length = 0
      });
    }

  }

  async crearContornoPersonalizado(){
    const alert = await this.alertCtrl.create({
      cssClass: 'a',
      subHeader: 'Contorno personalizado',
      inputs: [
        {
          name: 'contorno',
          placeholder: 'Nombre del contorno',
          cssClass: 'cantidad',
        },
      ],
       
      buttons: [
       , {
          text: 'Crear contorno',
          cssClass: 'a',
          handler: ( data) => {
            if(data.contorno != ''){
              let contorno = {
                contorno_id: '',
                grupo_id: '',
                personalizado: true,
                name: data.contorno,
                qty: 1
              }
              this.contornosAgregados.push(contorno)
            }else{
                this.toast('Dene ingresar un nombre', 'danger');
            }
                
        }
        },
 
        {
          text: 'cerrar',
          role: 'cancel',
          cssClass: 'a',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ],
        
    });

    await alert.present();
  }
  eliminarContornoAgregado(data, _index){

    this.contornosAgregados.splice(_index, 1)
    
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }
  
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

  cerralModal(){  
    this.modalCtrl.dismiss();
  }

}