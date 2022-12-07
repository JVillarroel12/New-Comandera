import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonInput, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modal-descuento-facturar',
  templateUrl: './modal-descuento-facturar.page.html',
  styleUrls: ['./modal-descuento-facturar.page.scss'],
})
export class ModalDescuentoFacturarPage implements OnInit {
  @ViewChild('porcentaje', {static: false}) porcentaje: IonInput;
  @ViewChild('montoBs', {static: false}) montoBs: IonInput;
  @Input() total;
  tema = localStorage.getItem('cambiarTema');
  btnGuardar:boolean = false;

  formDescuento: FormGroup;
  montoDescuento: number;
  porcentajeBsBoolean:boolean = false;
  porcentajeBs = 0;
  constructor(
    public formBuilder: FormBuilder,
    public modalController: ModalController,
    public toastController: ToastController
  ) { 
    this.tema = localStorage.getItem('cambiarTema');
  }

  ngOnInit() {
    this.formDescuento = this.formBuilder.group({
      montoBs: [null],
      porcentaje: [null]
    })
  }
  calcularDescuento(_event, _modo){ 
        setTimeout(() => {
          let cantDescuento = 0;
          let auxTotal = this.total;
          if(_modo == "p"){
              cantDescuento = auxTotal * (this.formDescuento.value.porcentaje) / 100;
              this.montoBs.value = '';
              this.porcentajeBsBoolean = false;
              this.porcentajeBs = 0;
            
          }
          if(_modo == "m"){
              cantDescuento = this.formDescuento.value.montoBs;
              this.porcentajeBs = this.formDescuento.value.montoBs * (100) / this.total;        
              this.porcentajeBsBoolean = true;
              this.porcentaje.value = '';
            

          }
          if(cantDescuento > this.total || cantDescuento < 0){
            this.toast("No puedes aplicar este descuento", "danger");

            this.btnGuardar = false;
            this.montoDescuento = 0;
          }else{
            this.montoDescuento = cantDescuento;
            this.btnGuardar = true;
          }
          
          if(this.formDescuento.value.porcentaje == null && this.formDescuento.value.montoBs == null
            ){
            this.montoDescuento = 0;
            this.porcentajeBsBoolean = false;
            this.porcentajeBs = 0;
            this.btnGuardar = false;
          }
        }, 50);


  }
  enviarDescuento(){
    this.modalController.dismiss({
      descuento: this.montoDescuento.toFixed(2)
    })


    console.log("DESCUENTOO SALIENDO =>", this.montoDescuento);
    
  }
  async cerralModal() {
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
