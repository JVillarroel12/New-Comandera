import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonButton, IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ModalContornosGeneralesPage } from '../modal-contornos-generales/modal-contornos-generales.page';
import { ApiServiceService } from '../../../services/api-service.service';
import { ModalContornosComandaPage } from '../modal-contornos-comanda/modal-contornos-comanda.page';
import { ModalClaveUsuarioPage } from '../modal-clave-usuario/modal-clave-usuario.page';

@Component({
  selector: 'app-modal-opcion-comandas',
  templateUrl: './modal-opcion-comandas.page.html',
  styleUrls: ['./modal-opcion-comandas.page.scss'],
})
export class ModalOpcionComandasPage implements OnInit {
  @Input('') comanda;
  @Input('') guardada;
  tema = localStorage.getItem('cambiarTema');
  @ViewChild('focus', { static: false }) focusInput: IonInput;
  activarFacturacion = localStorage.getItem('activarFacturacion');
  formCantidad: FormGroup;
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public http: HttpClient,
    public apiService: ApiServiceService,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController
  ) { }

  async ngOnInit() {
    console.log("COMANDAAAA =>", this.comanda);
    
     this.formCantidad = this.formBuilder.group({
      cantidad: [1]
     })
     setTimeout(() => {
      this.focusInput.setFocus();
     }, 50); 
    
  }
  pressGuardarCantidad(_event){
    if(_event == '13'){
      this.guardarCantidad();
    }
  }
  guardarCantidad(){
    let cantidad = this.formCantidad.value.cantidad;
    if(cantidad == 0 || cantidad == ''){
      this.comanda.cantidad = 1;
      this.toast("El campo esta vacio","warning")
    }else{
      if(cantidad < 0 ){
        this.toast("Esa cantidad no es posible","warning")
      }else{
        this.comanda.cantidad = cantidad;
        this.toast("Cantidad guardada","success")
        this.modalController.dismiss({
          comanda: this.comanda,
          cantidad: 'si'
        });
      }

    }
  }
  async agregarContorno(){
      const modal = await this.modalController.create({
        component: ModalContornosGeneralesPage,
        swipeToClose: true,
        backdropDismiss: true,
        cssClass: 'modalContornos',
        componentProps: {
          comandaModal: this.comanda,
        },
      });
      await modal.present();
      const comanda = await modal.onDidDismiss();
      if(comanda['data'] != undefined){
        this.modalController.dismiss({
          comanda: comanda['data'],
          contornos: 'si'
        });
      }
  }
  async borrarComanda(){
    if(this.guardada == 'no'){
      this.modalController.dismiss({
        comanda: this.comanda,
        borrar: 'si'
      });
    }else{
      const modal = await this.modalController.create({
        component: ModalClaveUsuarioPage,
        cssClass: 'modalClaveUsuario',
        componentProps: {
          mode : 'BORRAR_COMANDA'
        }
      })
      modal.present();
      const permiso = await modal.onDidDismiss();
      if(permiso['data'] != undefined){
        const loading = await this.loadingController.create({
          message: 'Cargando...',
          cssClass: 'spinner',
        });
        loading.present();
        this.http.delete(this.apiService.borrarComandaGuardada + this.comanda.comanda_id).subscribe(res=>{
          this.toast("Comanda borrada con exito", "success");
          loading.dismiss();
          console.log("res =>", res);
          this.modalController.dismiss({
            comanda: this.comanda,
            borrarComandaGuardada: 'si'
          });
        },(error)=>{
          console.log("ERROR =>", error.error);
          
          this.toast("Ha ocurrido un error al intentar borrar la comanda", "danger");
          loading.dismiss();
        })
      }
  
    }
  }
  async verContornosComanda(){
    if (this.comanda.contorno_comandas.length >= 1) {
      this.apiService.sendContornosComanda(this.comanda);
      const modal = await this.modalController.create({
        component: ModalContornosComandaPage,

        swipeToClose: true,
        backdropDismiss: false,
        cssClass: 'modalContornos',
      });
      await modal.present();
    } else {
      this.toast('Esta comanda no tiene contornos', 'warning');
    }
  }
  cerrarModal(){
    this.modalController.dismiss();
  }

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
}
