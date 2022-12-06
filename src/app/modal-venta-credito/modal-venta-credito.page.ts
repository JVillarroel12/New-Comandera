import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-modal-venta-credito',
  templateUrl: './modal-venta-credito.page.html',
  styleUrls: ['./modal-venta-credito.page.scss'],
})
export class ModalVentaCreditoPage implements OnInit {
  @Input('') faltante;
  @Input('') metodosPagos
  @Input('') pagos;
  @Input('') cuenta_id;
  tema = localStorage.getItem('cambiarTema');
  dateNow: any;
  formCredito: FormGroup;
  constructor(
    public modalController: ModalController,
    public apiService: ApiServiceService,
    public http: HttpClient,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { 
    this.tema = localStorage.getItem('cambiarTema');

  }

  ngOnInit() {
    this.formCredito = this.formBuilder.group({
      comentario: [''],
      fechaVencimiento: [''],
    })
    console.log("FALTANTE =>", this.faltante);
    console.log("PAGOS =>",this.pagos);
    
    this.dateNow = new Date().toISOString();

    console.log("FECHA HOY =>", this.dateNow);
    
    
  }

  formatDate(_value: string) {
    console.log(_value);
    
    return format(parseISO(_value), 'hh:mm:ss aa yyyy-MM-dd');
  }

  async guardarVentaCredito(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    let emision = new Date(this.dateNow).getTime();
    let vencimiento = new Date(this.formCredito.value.fechaVencimiento).getTime();;


    let credito = {
      fecha: emision - 14400000,
      vence: vencimiento - 14400000,
      saldo_ini: this.faltante,
      detalle: this.formCredito.value.comentario
    }

    this.pagos.credito = credito;
    console.log("credito A ENVIAR =>", this.pagos);

    this.http.post(this.apiService.facturarCuenta + this.cuenta_id, this.pagos).subscribe(res=>{
      console.log("RES =>", res);
      this.toast("Venta a credito realizada con exito", "success");
      loading.dismiss();

      // this.modalController.dismiss({
      //   credito: 'si'
      // })
    },(error)=>{
      console.log("ERROR =>", error.error);
      
      this.toast("Ha ocurrido un error guardando la venta a credito", "danger");
      loading.dismiss();
    })
    
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
  cerrarModal(){
    this.modalController.dismiss();
  }
}
