import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ModalAddClientePage } from '../modal-add-cliente/modal-add-cliente.page';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-modal-rrpp',
  templateUrl: './modal-rrpp.page.html',
  styleUrls: ['./modal-rrpp.page.scss'],
})
export class ModalRrppPage implements OnInit {
  @Input() cuenta;
  tema = localStorage.getItem('cambiarTema');
  formCliente: FormGroup;
  formComentario: FormGroup
  nombreCliente = '';

  rifCliente = '';
  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public modalController: ModalController,
    public apiService: ApiServiceService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    console.log("CUENTA =>", this.cuenta);
    
    this.tema = localStorage.getItem('cambiarTema');
    this.formCliente = this.formBuilder.group({
      rif: ['']
    });
    this.formComentario = this.formBuilder.group({
      comentario: ['']
    });
  }
  searchKeyCliente(_event){
    if(_event.charCode == "13"){
      this.searchCliente()
    }
  }
  async searchCliente(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    this.http.get(this.apiService.pedirCliente + this.formCliente.value.rif).subscribe(res=>{
      console.log("CLIENTE =>", res);
      this.nombreCliente = res['name'];
      this.rifCliente = res['rif']
      //this.id_cliente = res['client_id']
      let cuenta = {
        cuenta_id: this.cuenta['cuenta_id'],
        client_id: res['client_id']
      }
      this.http.put(this.apiService.cuentaCliente, cuenta).subscribe(res =>{
        console.log(res);
        this.toast("Se ha actualizado la cuenta", "success")
      },(error)=>{
        console.log(error.error);
        
        this.toast("Ha ocurrido un error asignando el cliente", "danger");  
      })
      loading.dismiss();
    },(error)=>{
      if(error.error.code == 404){
        this.toast("No se ha encontrado el cliente", "warning");
        this.addCliente();
      }else{
        this.toast("Ha ocurrido un error obteniendo el cliente", "danger");
      }
      console.log(error.error);
      loading.dismiss();
    })
  }
  async addCliente(){
    const modal = await this.modalController.create({
      component: ModalAddClientePage,
      cssClass: "modalAddCliente"
    })
    await modal.present();

    const cliente = await modal.onDidDismiss();
    if(cliente.data != undefined){

      let cuenta = {
        cuenta_id: this.cuenta['cuenta_id'],
        client_id: cliente['data'].data['client_id']
      }
      this.http.put(this.apiService.cuentaCliente, cuenta).subscribe(res =>{
        console.log(res);
        this.toast("Se ha actualizado la cuenta", "success");
        this.nombreCliente = cliente['data'].data.name;
        this.rifCliente = cliente['data'].data.rif;
      },(error)=>{
        console.log(error.error);
        
        this.toast("Ha ocurrido un error asignando el cliente", "danger");  
      })
    }

  }
  async guardarRRPP(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    let data = {
      dettale: this.formComentario.value.comentario
    }
    this.http.post(this.apiService.cuentaRRPP + this.cuenta['cuenta_id'],data).subscribe(res=>{
      console.log("RESPUESTA RRHH =>", res);
      //this.cerrarModal();
      loading.dismiss();

    },(error)=>{
      console.log("ERROR =>", error.error);
      
      loading.dismiss();
    })
  }
    /** MENSAJES DE RESPUESTA EN EL TOP**/
    async toast(msg, status) {
      const toast = await this.toastController.create({
        message: msg,
        position: 'top',
        color: status,
        duration: 3000,
        cssClass: 'toastCss',
      });
      toast.present();
    }

    cerrarModal(){
      this.modalController.dismiss();
    }
}
