import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ModalAddClientePage } from '../modal-add-cliente/modal-add-cliente.page';
import { ModalClaveUsuarioPage } from '../modal-clave-usuario/modal-clave-usuario.page';
import { ModalDescuentoFacturarPage } from '../modal-descuento-facturar/modal-descuento-facturar.page';
import { ModalPreciosPage } from '../modal-precios/modal-precios.page';
import { ModalSelectMonedaPage } from '../modal-select-moneda/modal-select-moneda.page';
import { ModalVentaCreditoPage } from '../modal-venta-credito/modal-venta-credito.page';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-modal-facturacion',
  templateUrl: './modal-facturacion.page.html',
  styleUrls: ['./modal-facturacion.page.scss'],
})
export class ModalFacturacionPage implements OnInit {
  @ViewChild('inputDescuento', {static: false}) inputDescuento: IonInput; 
  @Input() cuenta;
  @Input() max_descuento;
  @Input() mode;
  metodosPagos: any;
  linesPagos = [];
  tasa: any;
  tema = localStorage.getItem('cambiarTema');
  aplicarServicio: boolean = true;
  formImpuestos: FormGroup;
  formCliente: FormGroup;
  formComentario: FormGroup;
  totalBs: number;
  auxTotalBs: number;
  auxSubTotal = 0;
  auxIva = 0;
  auxServicio = 0;
  faltanteBs: number;
  montoDescuento:number;
  montoIva: number;
  montoServicio: number;
  IGTFBs: number = 0;
  nombreCliente = '';
  rifCliente = '';
  idCliente = ''
  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    public http: HttpClient,
    public apiService: ApiServiceService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder
  ) { 
    this.tema = localStorage.getItem('cambiarTema');
    

  }

  async ngOnInit() {
    console.log("MODOOOOO =>", this.mode);
    console.log("CUENTAAA=>", this.cuenta);
    if(this.mode == 'cuenta'){
      this.idCliente = this.cuenta['client_id']
    }else{
      this.idCliente = '0000000001';
    }
    this.totalBs = this.cuenta['subtotal'];
    this.auxSubTotal = this.cuenta['subtotal'];
    this.nombreCliente = this.cuenta['name'];
    this.rifCliente = this.cuenta['rif']
    this.pedirConversion();
    this.calcularTotal();
    this.formImpuestos = this.formBuilder.group({
      aplicarServicio: ['',],
      montoDescuento : [0]
    });
    this.formCliente = this.formBuilder.group({
      rif: ['', Validators.required]
    })
    this.formComentario = this.formBuilder.group({
      comentario: ['']
    })
  }
  async getMetodosPago(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    this.http.get(this.apiService.metodosPagos).subscribe(res=>{
      console.log("METODOS DE PAGO =>", res);
      this.metodosPagos = res;
      loading.dismiss();
    },(error)=>{
      console.log("Error =>", error.error);
      this.toast("Ha ocurrido un error obteniendo metodos de pago", "danger");
      loading.dismiss();
    })
  }
  async pedirConversion(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
      this.http.get(this.apiService.pedirConversiones).subscribe(
        (data) => {
          console.log('CONVERSIONEES', data);
          this.tasa = data['tasa'];
          loading.dismiss();
          this.getMetodosPago();

        },
        (error) => {
          this.toast("Ha ocurrido un error obteniendo la tasa, recargue por favor", "danger");
          console.log(error);
          loading.dismiss();
        }
      );
  }
  async openPayment(_data){
    if(this.faltanteBs > 0){
      const modal = await this.modalController.create({
        component: ModalSelectMonedaPage,
        cssClass: 'modalSelectMoneda',
        componentProps: {
          pago: _data,
          total: this.faltanteBs,
          tasa: this.tasa,
          totalDolar: Number(this.faltanteBs/this.tasa).toFixed(2)
        }
      })
      modal.present();
  
      const { data } = await modal.onDidDismiss();
  
      if(data != undefined){
        console.log(data.data);
        if(data.data.igtf > 0){
          console.log("AGREGANDO IGTFFFF");
          
          this.IGTFBs = Math.round(this.IGTFBs*100)/100 +  Math.round(data.data.igtf*100)/100;
          this.auxTotalBs = this.auxTotalBs + this.IGTFBs;
          this.faltanteBs = this.faltanteBs + this.IGTFBs;
        }
        this.linesPagos.push(data.data);
        this.calcularFaltantePagar(data.data);
      }
    }else{
      this.toast("No puede agregar mas metodos de pago", "danger");
    }

  }
  async borrarPago(_pago, _index){

    const alert = await this.alertController.create({
      cssClass: 'borrarPago',
      message: '¿Estas seguro de que quieres borrar esta pago?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            let sumaTotal = 0;
            if(_pago.tipo == "US" || _pago.tipo == "AN" || _pago.tipo == "ZE"){
              sumaTotal = _pago.auxMontoBs;
            }else{
              sumaTotal = _pago.monto;
            }
            if(_pago.igtf > 0){
              this.faltanteBs = this.faltanteBs - this.IGTFBs;
              this.auxTotalBs = this.auxTotalBs - this.IGTFBs;
              this.IGTFBs = 0;
            }
            this.faltanteBs = this.faltanteBs + sumaTotal;
            this.linesPagos.splice(_index, 1);
          }
        }
      ]
    });

    await alert.present();

  }
  aplicarPorcentajeServicio(_event){
    this.montoDescuento = 0;
    if (_event.detail.checked == true) {
      this.aplicarServicio = true;
      this.linesPagos.length = 0;
      this.IGTFBs = 0;
      this.calcularTotal();
    }else{
      this.aplicarServicio = false;
      this.linesPagos.length = 0;
      this.IGTFBs = 0;
      this.calcularTotal();
    }
  }
  async modalDescuento(){
    this.montoDescuento = 0;
    const modal = await this.modalController.create({
      component: ModalDescuentoFacturarPage,
      cssClass: 'modalSelectMoneda',
      componentProps: {
        total: this.cuenta['subtotal']
      }
    })
    modal.present();
    const descuento = await modal.onDidDismiss();

    if(descuento.data != undefined){
      this.inputDescuento.value =  descuento.data['descuento'];
      console.log("Descuento =>", descuento.data);
      this.montoDescuento = descuento.data['descuento'];
      this.aplicarDescuento();
    }
  }
  aplicarDescuento(){
    this.montoServicio = 0;
    this.auxIva = this.montoIva;
    let descuento = this.formImpuestos.value.montoDescuento;
    this.auxSubTotal = this.cuenta['subtotal'];
    let porcentajeDescuento = descuento * (100) / this.auxSubTotal;
    
    let descuentoIva2 = porcentajeDescuento * (this.auxIva) / 100;

     if( descuento > this.auxTotalBs || porcentajeDescuento > this.max_descuento){
       this.toast(`No puedes aplicar un descuento mayor al total o mayor a ${this.max_descuento}%`, "danger");
       this.montoDescuento = 0;
       this.inputDescuento.value = 0;
       this.auxTotalBs = this.totalBs + this.montoIva;
     }else{
      //this.auxIva = descuentoIva * (100) / this.montoIva;
      this.auxSubTotal = this.cuenta['subtotal'] - descuento;
      let porcentajeServicio = this.auxSubTotal*(this.cuenta['porcentservice'] / 100);
      this.montoServicio = porcentajeServicio;

      this.auxIva = this.auxIva - descuentoIva2;

      this.auxTotalBs = Math.round(this.totalBs*100)/100 - Math.round(descuento*100)/100 + Math.round(this.auxIva*100)/100 + Math.round(this.montoServicio*100)/100;
      this.faltanteBs = Math.round(this.auxTotalBs*100)/100;
      this.linesPagos.length = 0;
      this.montoDescuento = descuento;
     }


  }
  calcularTotal(){
    console.log("SI PASA POR AQUIIIIIIIIIIIIIIIIIIIIII");
    
    this.montoIva = this.cuenta['iva'];
    if(this.aplicarServicio == true){
      let porcentajeServicio = this.auxSubTotal*(this.cuenta['porcentservice'] / 100);
      this.montoServicio = porcentajeServicio;
    }else{
      
      this.montoServicio = 0;
    }
    setTimeout(() => {
      console.log("TOTAL =>", this.totalBs);
      console.log("TOTAL IVA =>", this.auxIva);
      console.log("TOTAL SERVICIO =>", this.montoServicio);
      console.log("TOTAL IGTF =>", this.IGTFBs);
        
      this.auxTotalBs = Math.round(this.totalBs*100)/100 + Math.round(this.auxIva*100)/100 + Math.round(this.montoServicio*100)/100 + Math.round( this.IGTFBs*100)/100;   
      this.faltanteBs = Math.round(this.auxTotalBs*100)/100;
    }, 100);
  }
  calcularFaltantePagar(_pago){
    let restaTotal = 0;
    if(_pago.tipo == "US" || _pago.tipo == "AN" || _pago.tipo == "ZE"){
      restaTotal = _pago.auxMontoBs;
    }else{
      restaTotal = _pago.monto;
    }
    this.auxTotalBs = Math.round(this.auxTotalBs * 100) / 100;
    this.faltanteBs = Math.round(this.faltanteBs*100)/100 - Math.round(restaTotal*100)/100;
  }
  async pagarCuenta(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    let auxFaltantebsBs = Number(this.faltanteBs.toFixed(2))

    if(this.mode == "cuenta"){
      if(auxFaltantebsBs <= 0){
        let auxLinesPagos = this.linesPagos
        auxLinesPagos.forEach(res=>{
          if(res.tipo == "US" || res.tipo == "AN" || res.tipo == "ZE"){
            res.auxMontoBs = res.auxMontoBs;
          }else{
            res.auxMontoBs = res.monto;
          }
        })
  
        let pagos = {
          detalle:  this.formComentario.value.comentario,
          usar_servicio: this.aplicarServicio,
          descuento: Number(this.montoDescuento),
          detalle_pagos: auxLinesPagos
        }
  
        console.log("METODOS DE PAGO =>", pagos);
        
        this.http.post(this.apiService.facturarCuenta + this.cuenta['cuenta_id'], pagos).subscribe(res=>{
          console.log(res);
          this.toast("Cuenta facturada exitosamente","success");
          loading.dismiss();
          // this.modalController.dismiss({
          //   facturacion: 'si'
          // });
        },(error)=>{
          loading.dismiss();
          console.log(error);
          this.toast(error.error.message, "danger")
        })
       }else{
         this.toast(`Quedan faltantes = ${Math.round(this.faltanteBs*100)/100}bs`,"danger");
         let auxLinesPagos = this.linesPagos
         let pagos = {
          detalle:  this.formComentario.value.comentario,
          usar_servicio: this.aplicarServicio,
          descuento: Number(this.montoDescuento),
          detalle_pagos: auxLinesPagos
        }
         this.alertVentaCredito(pagos);

         loading.dismiss();
      }
    }else{
      if(auxFaltantebsBs <= 0){
        let auxLinesPagos = this.linesPagos
        auxLinesPagos.forEach(res=>{
          if(res.tipo == "US" || res.tipo == "AN" || res.tipo == "ZE"){
            res.auxMontoBs = res.auxMontoBs;
          }else{
            res.auxMontoBs = res.monto;
          }
        })
  
        let pagos = {
          detalle: this.formComentario.value.comentario,
          usar_servicio: this.aplicarServicio,
          descuento: Number(this.montoDescuento),
          detalle_pagos: auxLinesPagos,
          comandas: this.cuenta['comandas'],
          cliente_id: this.idCliente
        }
  
        console.log("METODOS DE PAGO =>", pagos);
        
        this.http.post(this.apiService.facturarCuenta, pagos).subscribe(res=>{
          console.log("PAGANDO DESDE CAJA",res);
          this.toast("Cuenta facturada exitosamente","success");
          loading.dismiss();
          // this.modalController.dismiss({
          //   facturacion: 'si'
          // });
        },(error)=>{
          loading.dismiss();
          console.log(error);
          this.toast(error.error.message, "danger")
        })
       }else{
         this.toast(`Quedan faltantes = ${Math.round(this.faltanteBs*100)/100}bs`,"danger");
         let auxLinesPagos = this.linesPagos;
         let pagos = {
          detalle: this.formComentario.value.comentario,
          usar_servicio: this.aplicarServicio,
          descuento: Number(this.montoDescuento),
          detalle_pagos: auxLinesPagos,
          comandas: this.cuenta['comandas'],
          cliente_id: this.idCliente
        }
         this.alertVentaCredito(pagos);
         loading.dismiss();
      }
    }

  }
  async alertVentaCredito(_pagos){
    const alert = await this.alertController.create({
      header: 'Venta a credito',
      subHeader: 'Quieres pagar esta cuenta a credito?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            console.log("CLIENTE =>", this.idCliente);
            if(this.idCliente == '0000000001'){
              this.toast("No hay un cliente asignado", "danger")
            }else{
              console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");
              
              this.modalVentaCredito(_pagos);
            }
          },
        },
      ],
    });

    await alert.present();

  }
  async modalVentaCredito(_pagos){
    let cuenta = ''
    if(this.mode == 'cuenta'){
      cuenta= this.cuenta['cuenta_id']
    }else{
      cuenta = '';
    }
    const modal = await this.modalController.create({
      component: ModalClaveUsuarioPage,
      cssClass: 'modalClaveUsuario',
      componentProps: {
        mode: 'FACTURA_CREDITO'
      }
    })
    modal.present();
    const permiso = await modal.onDidDismiss();
    if(permiso['data'] != undefined){
      const modal = await this.modalController.create({
        component: ModalVentaCreditoPage,
        cssClass: 'modalVentaCredito',
        componentProps: {
          faltante: this.faltanteBs,
          metodosPagos: this.linesPagos,
          pagos: _pagos,
          cuenta_id: cuenta
        }
      })
      modal.present();
      const credito = await modal.onDidDismiss();

      if(credito['data'] != undefined){
        this.modalController.dismiss({
          facturacion: 'si'
        });
      }
    }

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
      this.rifCliente = res['rif'];
      this.idCliente = res['client_id']
      if(this.cuenta['cuenta_id'] != undefined){
        let cuenta = {
          cuenta_id: this.cuenta['cuenta_id'],
          client_id: res['client_id']
        }
        this.http.put(this.apiService.cuentaCliente, cuenta).subscribe(res =>{
          console.log(res);
          loading.dismiss();
        },(error)=>{
          console.log(error.error);
          loading.dismiss();
          this.toast("Ha ocurrido un error asignando el cliente", "danger");  
        })
      }else{
        loading.dismiss();
      }

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
      this.idCliente = cliente['data'].data['client_id']
      if(this.cuenta['cuenta_id'] != undefined){
        this.http.put(this.apiService.cuentaCliente, cuenta).subscribe(res =>{
          console.log(res);
          this.toast("Se ha actualizado la cuenta", "success");
          this.nombreCliente = cliente['data'].data.name;
          this.rifCliente = cliente['data'].data.rif;
        },(error)=>{
          console.log(error.error);
          
          this.toast("Ha ocurrido un error asignando el cliente", "danger");  
        })
      }else{
        this.nombreCliente = cliente['data'].data.name;
        this.rifCliente = cliente['data'].data.rif;
      }

    }
  }
  async toast(msg, status) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 2000,
      cssClass: 'toastCss',
    });
    toast.present();
  }

  async cerralModal(){

      this.modalController.dismiss();
    
  }
}
