import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonButton, IonInput, ModalController, ToastController } from '@ionic/angular';
import { ModalContornosGeneralesPage } from '../modal-contornos-generales/modal-contornos-generales.page';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-modal-opcion-comandas',
  templateUrl: './modal-opcion-comandas.page.html',
  styleUrls: ['./modal-opcion-comandas.page.scss'],
})
export class ModalOpcionComandasPage implements OnInit {
  @Input('') comanda;
  tema = localStorage.getItem('cambiarTema');
  @ViewChild('focus', { static: false }) focusInput: IonInput;
  formCantidad: FormGroup;
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public http: HttpClient,
    public apiService: ApiServiceService,
    public formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
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
  borrarComanda(){
    this.modalController.dismiss({
      comanda: this.comanda,
      borrar: 'si'
    });
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
