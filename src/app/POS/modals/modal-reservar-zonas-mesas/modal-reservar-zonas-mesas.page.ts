import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalAddReservaPage } from '../modal-add-reserva/modal-add-reserva.page';

@Component({
  selector: 'app-modal-reservar-zonas-mesas',
  templateUrl: './modal-reservar-zonas-mesas.page.html',
  styleUrls: ['./modal-reservar-zonas-mesas.page.scss'],
})
export class ModalReservarZonasMesasPage implements OnInit {
  @Input() zonas;
  @Input() user;
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public modalController: ModalController,
    public toastController: ToastController
  ) { 
    this.tema = localStorage.getItem('cambiarTema');
  }
  mesas = []
  mesasSeleccionadas = [];
  zonasSeleccionadas = [];
  ngOnInit() {
    this.mesasSeleccionadas.length = 0;
    this.zonas.forEach(element => {
      element.seleccionada = "no";


    });
  }
  mostrarMesas(_data,_index){

    this.mesas = _data.mesas;
    /*const comprobador = this.zonasSeleccionadas.find((element)=>{
      return element.value == _data.value;
    });
        // ? NO ESTA
        if(comprobador == undefined){
          _data.seleccionada = "si";
          this.zonasSeleccionadas.push(_data);
        }else{
        // ? SI ESTA  
          _data.seleccionada = "no";
          this.zonasSeleccionadas.splice(_index,1);
        }*/
  }
  seleccionarZona(event, _data, _index) {

    if (event.detail.checked == true) {
      _data.seleccionada = "si";
      _data['mesas'].forEach(mesas => {
        
        const comprobador = this.mesasSeleccionadas.find((element)=>{
          return element.mesa_id == mesas.mesa_id
        })
        if (comprobador == undefined) {
          this.mesasSeleccionadas.push(mesas);
          mesas.seleccionada = "si";

        }
      });

      this.zonasSeleccionadas.push(_data);

    } else {
      _data.seleccionada = "no";
      _data['mesas'].forEach(mesa => {
        mesa.seleccionada = "no";
          this.mesasSeleccionadas = this.mesasSeleccionadas.filter(item => item.mesa_id !== mesa.mesa_id);
      
      });

      this.zonasSeleccionadas.splice(_index,1);
    }

  }
  seleccionarMesa(_data,_index){
    let comprobar: boolean = false;

    this.mesasSeleccionadas.forEach(res=>{
 
      if(res.mesa_id == _data.mesa_id){
        comprobar = true;    
      }

    });
      if(comprobar){
        _data.seleccionada = "no";
        this.mesasSeleccionadas = this.mesasSeleccionadas.filter(item => item.mesa_id !== _data.mesa_id);
      }else{
        
        _data.seleccionada = "si"
        this.mesasSeleccionadas.push(_data);
      }
  }
  async enviarMesas(){

    const modal = await this.modalController.create({
      component: ModalAddReservaPage,
      cssClass: "modalReserva",
      componentProps:{
        mesa: this.mesasSeleccionadas,
        user: this.user,
      }
    })
    modal.present();
    const reserva = await modal.onDidDismiss();

    if(reserva['data'] != undefined){
      console.log("SI ESTA PASANDO", reserva);
      this.modalController.dismiss({
        data: 'EXITO',
      });
    }

  }

  cerralModal(){  
    this.modalController.dismiss();
    this.modalController.dismiss({
      data: 'EXITO',
    });
  }
  /** CERRAR SESION**/
 
  async toast(msg, status){
    const toast = await this.toastController.create({
      message:msg,
      position:'top',
      color: status,
      duration: 3000,
      cssClass:"toastCss"
    });
    toast.present();
  }
}
