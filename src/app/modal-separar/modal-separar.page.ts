import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../services/api-service.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
export interface Comanda {
  cuenta_id: number;
  product: number;
  category_id: number;
  comanda_id: number;
  name: string;
  pricebase: number;
  price: number;
  qty: number;
  discount: number;
  iva: number;
  user_id: number;
  estacion_id: number;
  deposito_id: number;
  status: string;
}
@Component({
  selector: 'app-modal-separar',
  templateUrl: './modal-separar.page.html',
  styleUrls: ['./modal-separar.page.scss'],
})
export class ModalSepararPage implements OnInit {

  @Input() idMesa;
  @Input() dataCuentas;

  cuentasSaliendo: any;
  cuentasSeleccionadas = [];
 

  cuentaPrincipal = [];
  comandasCuentaPrincipal: any;
  nuevaCuenta = [];
  comandasNuevaCuenta = [];

  cantidadComanda: number;
  idCuentaPrimaria: any;



  copiaArreglo: any;
  buscarComanda: any;
  comandaId: any;
  id: any;
  mostrarFooter = false;
  arrastrarDataComanda: any;
  prueba = [];
  IdCuentaPrincipal: any;
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public apiService: ApiServiceService,
    public http: HttpClient,
    public alertCtlr: AlertController,
    public modalCtrl: ModalController,
    public toastr: ToastController,
    public loadingCtrl: LoadingController,
    public location: Location,
    public platform: Platform,
    public router: Router
  ) {
    this.tema = localStorage.getItem('cambiarTema');
  }

  async ngOnInit() {

    console.log("MESA ID", this.idMesa);
     console.log("CUENTAS QUE VIENE",this.dataCuentas);
      
     this.cuentaPrincipal = this.dataCuentas[0];
     this.nuevaCuenta = this.dataCuentas[1];


     console.log("NUEVA CUENTA =>", this.nuevaCuenta);
     
    this.platform.backButton.subscribeWithPriority(10,() => {

      if(this.location.isCurrentPathEqualTo('/modal-separar')){
        this.modalCtrl.dismiss();
      }
      this.modalCtrl.dismiss();
  }); 
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    /** CODIGO PARA OBTENER LAS CUENTAS SELECCIONADAS**/

      this.IdCuentaPrincipal = this.dataCuentas[0].cuenta_id;
    
    this.http
    .get(this.apiService.getComandasUrl + this.IdCuentaPrincipal)
    .subscribe(
      (data) => {
        console.log('LLEGANDO COMANDAS', data);
        this.comandasCuentaPrincipal = data;
        this.idCuentaPrimaria = data['cuenta_id'];
        loading.dismiss();
      },
      (error) => {
        if(error.error['logout'] == true){
          this.router.navigate(['/login']);
          this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
        }else{
          this.toast('Ha ocurrido un error', 'danger');
        }
        loading.dismiss();
      }
    );
    /** OBTENER EL ID DE LA MESA**/
    this.apiService.$getIdMesa.subscribe((id) => {
      this.id = id;
      console.log(this.id);
    });
  }
  /** ALERTA PARA UNIR TODA LA CUENTA**/
  async alertaUnirTodaCuenta() {
    const alert = await this.alertCtlr.create({
      cssClass: 'my-custom-class',
      subHeader: '¿Estas seguro de que quieres unir toda la cuenta?',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.unirCuentas();
          },
        },
      ],
    });
    await alert.present();
  }
  /**FUNCION PARA UNIR TODA LA CUENTA **/
  async unirCuentas() {
    if (this.dataCuentas.length > 2) {
      alert('nop');
    } else {

      this.comandasCuentaPrincipal.forEach(res=>{
        this.nuevaCuenta['comandas'].push(res);
      })
      this.comandasNuevaCuenta.forEach(res=>{
        this.nuevaCuenta['comandas'].push(res);
      })
      const loading = await this.loadingCtrl.create({
        message: 'Cargando...',
        cssClass: 'spinner',
      });
      loading.present();

      let dataUnirTodaCuentas = {
        envia: this.cuentaPrincipal,
        recibe: this.nuevaCuenta
      };
      console.log('JSON PARA ENVIAR', dataUnirTodaCuentas);

      return this.http
        .post(this.apiService.separarCuentas, dataUnirTodaCuentas)
        .subscribe(
          (data) => {
            console.log(data);

            this.toast(
              'Se ha pasado toda la cuenta satisfactoriamente',
              'success'
            );

            this.http
              .get(this.apiService.getMesa + this.idMesa)
              .subscribe((data) => {
                console.log('saliendoo', data);
                this.cuentasSaliendo = data['cuentas'];
                this.modalCtrl.dismiss({
                  data: this.cuentasSaliendo,
                });
              });
            loading.dismiss();
          },
          (error) => {
            if(error.error['logout'] == true){
              this.router.navigate(['/login']);
              this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
            }else{
              this.toast('Ha ocurrido un error', 'danger');
            }
            loading.dismiss();
          }
        );
    }
  }
  /** PASAR COMANDAS POR CANTIDAD**/
  /** ALERTA PARA ELEGIR CANTIDAD**/
  async pasarComanda(_data, _index) {
    const alert = await this.alertCtlr.create({
      cssClass: 'my-custom-class',
      subHeader: 'Cantidad',
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Cantidad',
        },
      ],
      buttons: [
        {
          text: 'Pasar todo',
          cssClass: 'success',
          handler: (data) => {
            this.cantidadComanda = data.cantidad;
            /** SI VAN A PASAR TODA LA CANTIDAD**/
            this.pasarComandaBorrar(_data, _data.qty, _index);
            /** MOSTRAR EL BOTON DE UNIR CUENTAS SI SON POR CANTIDAD**/
            if (this.comandasNuevaCuenta.length >= 1) {
              this.mostrarFooter = true;
            } else {
              this.mostrarFooter = false;
            }
          },
        },
        {
          text: 'Enviar',
          handler: (data) => {
            this.cantidadComanda = data.cantidad;
            /** SI LA CANTIDAD ES MAYOR**/
              if (data.cantidad == 0) {
                this.toast('No se puede pasar cantidad en 0 o vacia', 'danger');
              } else {
                if (Number(data.cantidad) > _data.qty) {
                  this.toast('No puede ser una cantidad mayor', 'danger');
                } else {
                  if (Number(data.cantidad) < _data.qty) {
                    /** LLAMAR A LA FUNCION PARA RESTAR LA CANTIDAD**/
                    this.restaCantidadComanda(_data, this.cantidadComanda);
                    /** LLAMAR A LA FUNCION PARA PASAR LA COMANDA A LA LISTA DE UNION**/
                    this.pasarComandaUnion(_data, this.cantidadComanda);
                  } else {
                    if (Number(data.cantidad) == _data.qty) {
                      /** SI VAN A PASAR TODA LA CANTIDAD**/
                      this.pasarComandaBorrar(
                        _data,
                        this.cantidadComanda,
                        _index
                      );
                    }
                  }
                }
              
            }


            /** MOSTRAR EL BOTON DE UNIR CUENTAS SI SON POR CANTIDAD**/
            if (this.comandasNuevaCuenta.length >= 1) {
              this.mostrarFooter = true;
            } else {
              this.mostrarFooter = false;
            }
          },
        },
      ],
    });
    await alert.present();
  }
  /** AL PASAR TODA LA CANTIDAD DE LA COMANDA, BORRAR DEL ARREGLO**/
  pasarComandaBorrar(_data, _cantidad, _index) {
    // ! BUSCAMOS LA COMANDA
    const comprobador = this.comandasNuevaCuenta.find((element) => {
      return element.comanda_id == _data.comanda_id;
    });
    // ! SI NO ESTA PASAR TODA LA CANTIDAD
    if (comprobador == undefined) {
      console.log(comprobador);
      _data.status = 't';
      _data.qtyAux = Number(_cantidad);
      this.comandasNuevaCuenta.push(_data);
      //console.log("no esta");
    } else {
      // ! SI ESTA, SUMAR LAS CANTIDADES
      console.log('AQUI ESTAAAA', comprobador);
      // console.log("si esta");
      comprobador.status = 't';
      comprobador.qtyAux = Number(comprobador.qtyAux) + Number(_cantidad);
    }
    // ? BORRAR COMANDAS
    this.comandasCuentaPrincipal.splice(_index, 1);
  }
  /** FUNCION QUE SE ENCARGA DE PASAR LA COMANDA POR CANTIDAD AL OTRO ARRAY**/
  pasarComandaUnion(_comanda, _cantidad) {
    // ! COMPROBAMOS SI ENCUENTRA LA COMANDA
    const comprobador = this.comandasNuevaCuenta.find((element) => {
      return element.comanda_id == _comanda.comanda_id;
    });
    // ! SI NO ESTA PASAMOS TODA LA CANTIDAD
    if (comprobador == undefined) {
      console.log(comprobador);
      _comanda.status = 's';
      _comanda.qtyAux = Number(_cantidad);
      this.comandasNuevaCuenta.push(_comanda);

      //console.log("no esta");
    } else {
      // ! SI ESTA, SUMAMOS LA CANTIDAD
      console.log('AQUI ESTAAAA', comprobador);
      // console.log("si esta");
      comprobador.status = 's';
      comprobador.qtyAux = Number(comprobador.qtyAux) + Number(_cantidad);
    }
  }
  /** FUNCION PARA RESTAR LA CANTIDAD DE LA COMANDA SI NO SE PASA TODA **/
  restaCantidadComanda(_comanda: Comanda, cantidad) {
    this.comandasCuentaPrincipal.forEach((res) => {
      if (res == _comanda) {
        _comanda.qty = _comanda.qty - cantidad;
        console.log(res.qty);
      }
    });
  }
  devolverComanda(_data, _index) {
    // ! BUSCAMOS LA COMANDA
    const comprobador = this.comandasCuentaPrincipal.find((element) => {
      return element.comanda_id == _data.comanda_id;
    });

    // ! SI NO ESTA, DEVOLVEMOS TODA LA CANTIDAD
    if (comprobador == undefined) {
      console.log(comprobador);
      _data.qty = _data.qtyAux;

      this.comandasCuentaPrincipal.push(_data);
    } else {
      // ! SI ESTA, DEVOLVEMOS Y SUMAMOS TODAS LAS CANTIDADES
      // console.log("si esta");
      comprobador.status = 's';
      comprobador.qty = Number(comprobador.qty) + comprobador.qtyAux;
    }
    // ? BORRAR COMANDA
    this.comandasNuevaCuenta.splice(_index, 1);
  }
  /** ENVIAR LOS DATOS AL SERVIDOR PARA GUARDARLOS**/
  async guardarItems() {
    this.cuentaPrincipal['comandas'] = this.comandasCuentaPrincipal;
    this.nuevaCuenta['comandas'] = this.comandasNuevaCuenta;
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();

    let dataSepararCuentas = {
      envia: this.cuentaPrincipal,
      recibe: this.nuevaCuenta
    };
    console.log('JSON PARA ENVIAR', dataSepararCuentas);

    return this.http
      .post(this.apiService.separarCuentas, dataSepararCuentas)
      .subscribe((data) => {
        console.log(data);

        this.http.get(this.apiService.getMesa + this.idMesa).subscribe((data) => {
          console.log('saliendoo', data);
          this.cuentasSaliendo = data['cuentas'];
          this.modalCtrl.dismiss({
            data: this.cuentasSaliendo,
          });
          loading.dismiss();
        });
      },(error)=>{
        if(error.error['logout'] == true){
          this.router.navigate(['/login']);
          this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
        }else{
          this.toast('Ha ocurrido un error', 'danger');
        }
        console.log(error);
        loading.dismiss();
        
      });
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //     console.log('se queda');
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //     console.log('se va');
  //   }
  // }

  /** MENSAJES DE RESPUESTA EN EL TOP**/
  async toast(msg, status) {
    const toast = await this.toastr.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 2000,
      cssClass: 'toastCss',
    });
    toast.present();
  }
  /** PARA CERRAR EL MODAL Y MANDAR LA DATA OBTENIDA A LA VISTA DE CUENTAS**/
  async cerralModal() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    this.http.get(this.apiService.getMesa + this.idMesa).subscribe((data) => {
      console.log('saliendoo', data);
      this.cuentasSaliendo = data['cuentas'];
      this.modalCtrl.dismiss({
        data: this.cuentasSaliendo,
      });
      loading.dismiss();
    },(error)=>{
      console.log("ERROR =>", error.error);
       this.toast("Ha ocurrido un error", "danger");
       loading.dismiss(); 
    });
  }
}
