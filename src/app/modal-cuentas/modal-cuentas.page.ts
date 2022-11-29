import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../services/api-service.service';
import { Location } from '@angular/common';
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
  selector: 'app-modal-cuentas',
  templateUrl: './modal-cuentas.page.html',
  styleUrls: ['./modal-cuentas.page.scss'],
})
export class ModalCuentasPage implements OnInit {

  @Input() dataCuentas;
  @Input() idMesa;

  cuentasSaliendo: any;
  cuentasSeleccionadas = [];

  cuentaPrincipal = [];
  cuentaSecundaria = [];
  comandascuentaPrincipal: any;
  comandascuentaSecundaria: any;

  cantidadComanda: number;

  idCuentaPrimaria: any;
  idCuentaSecundaria: any;

  comandasUnion = [];
  copiaArreglo: any;

  buscarComanda: any;
  comandaId: any;

  mostrarFooter = false;

  arrastrarDataComanda: any;
  getIdCuentaSecundaria: any;
  tema = localStorage.getItem('cambiarTema');

  constructor(
    public modalCtrl: ModalController,
    public apiService: ApiServiceService,
    public http: HttpClient,
    public alertCtlr: AlertController,
    public toastr: ToastController,
    public loadingCtrl: LoadingController,
    public location: Location,
    public platform: Platform,
    public router: Router
  ) {
    this.tema = localStorage.getItem('cambiarTema');
  }

  async ngOnInit() {

    console.log("CUENTAAAAAS", this.dataCuentas);
    
    this.platform.backButton.subscribeWithPriority(10,() => {

      if(this.location.isCurrentPathEqualTo('/modal-cuentas')){
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

      this.cuentaPrincipal = this.dataCuentas[0];
      this.cuentaSecundaria = this.dataCuentas[1];
      
        //console.log('llegando cuentas', this.cuentas);

        /** OBTENER RLAS COMANDAS DE LA CUENTA PRINCIPAL POR ID**/
        let idCuentaPrincipal = this.dataCuentas[0].cuenta_id;
        
        this.http
          .get(this.apiService.getComandasUrl + idCuentaPrincipal)
          .subscribe((data) => {
            console.log('LLEGANDO DATAA CUENTA PRINCIPAL', data);
            this.idCuentaPrimaria = data['cuenta_id'];

            this.comandascuentaPrincipal = data;
            this.http
            .get(this.apiService.getComandasUrl + this.getIdCuentaSecundaria)
            .subscribe((data) => {
              console.log('LLEGANDO DATAA CUENTA SECUNDARIA', data);
              this.idCuentaSecundaria = data['cuenta_id'];
        
              this.comandascuentaSecundaria = data;
              
              //console.log('CUENTA SECUNDARIA',this.cuentaSecundaria['cuenta_id']);
        
              this.copiaArreglo = JSON.parse(JSON.stringify(data));
              loading.dismiss();
            },(error)=>{
              loading.dismiss();
              if (error.error['logout'] == true) {
                this.router.navigate(['/login']);
                this.toast(
                  'Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado',
                  'danger'
                );
              } else {
                this.toast('Ha ocurrido un error', 'danger');
              }
            });
          },(error)=>{
            loading.dismiss();
            if (error.error['logout'] == true) {
              this.router.navigate(['/login']);
              this.toast(
                'Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado',
                'danger'
              );
            } else {
              this.toast('Ha ocurrido un error', 'danger');
            }
          });

        /** OBTENER RLAS COMANDAS DE LA CUENTA SECUNDARIA POR ID**/
        this.getIdCuentaSecundaria = this.dataCuentas[1].cuenta_id;

    /** OBTENER EL ID DE LA MESA**/
      //console.log(this.id);
    
  }

  /** ALERTA EMERGENTE PARA UNIR TODA LA CUENTA**/
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

  /** FUNCION PARA UNIR TODAS LAS COMANDAS DE LAS CUENTA**/
  async unirCuentas() {
    this.cuentaPrincipal['comandas'] = this.comandascuentaPrincipal;
    console.log("antes de", this.cuentaPrincipal);
    
    if (this.dataCuentas.length > 2) {
      alert('nop');
    } else {

      this.comandascuentaSecundaria.forEach(res=>{
        this.cuentaPrincipal['comandas'].push(res);
      });
      
      this.comandasUnion.forEach(res=>{
        this.cuentaPrincipal['comandas'].push(res);
      })

      console.log("despues de", this.cuentaPrincipal);
      
      const loading = await this.loadingCtrl.create({
        message: 'Cargando...',
        cssClass: 'spinner',
      });
      loading.present();
      let dataUnirCuentas = {
        recibe: this.cuentaPrincipal,
        envia: this.cuentaSecundaria,
      };
      console.log('JSON PARA ENVIAR', dataUnirCuentas);

      return this.http
        .post(this.apiService.unirCuenta, dataUnirCuentas)
        .subscribe(
          (data) => {
            console.log(data);
            this.toast(
              'Las cuentas se han unido satisfactoriamente',
              'success'
            );
              loading.dismiss();
            this.http.get(this.apiService.getMesa + this.idMesa).subscribe(
              (data) => {
                this.cuentasSaliendo = data['cuentas'];

                this.modalCtrl.dismiss({
                  data: this.cuentasSaliendo,
                });
                loading.dismiss();
              },
              (error) => {
                console.log(error);
                if(error.error['logout'] == true){
                  this.router.navigate(['/login']);
                  this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
                }else{
                  this.toast('Ha ocurrido un error', 'danger');
                }
                loading.dismiss();
              }
            );
          },
          (error) => {
            console.log(error);
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
            console.log("PASANDO TODO",_data.qty);
            
            /** SI VAN A PASAR TODA LA CANTIDAD**/
            this.pasarComandaBorrar(_data, _data.qty, _index);
            /** MOSTRAR EL BOTON DE UNIR CUENTAS SI SON POR CANTIDAD**/
            if (this.comandasUnion.length >= 1) {
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
                  if (Number(data.cantidad) == _data.qty) {
                    console.log('es igual la cantidad');
  
                    /** SI VAN A PASAR TODA LA CANTIDAD**/
                    this.pasarComandaBorrar(_data, this.cantidadComanda, _index);
                  } else {
                    console.log('la cantidad es menor');
  
                    if (Number(data.cantidad) < _data.qty) {
                      /** LLAMAR A LA FUNCION PARA RESTAR LA CANTIDAD**/
                      this.restaCantidadComanda(_data, this.cantidadComanda);
                      /** LLAMAR A LA FUNCION PARA PASAR LA COMANDA A LA LISTA DE UNION**/
                      this.pasarComandaUnion(_data, this.cantidadComanda);
                    }
                  }
                }            
            }


            /** MOSTRAR EL BOTON DE UNIR CUENTAS SI SON POR CANTIDAD**/
            if (this.comandasUnion.length >= 1) {
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
    console.log('INDEEEX', _index);

    // ! BUSCAMOS LA COMANDA
    const comprobador = this.comandasUnion.find((element) => {
      return element.comanda_id == _data.comanda_id;
    });
    // ! SI NO ESTA PASAR TODA LA CANTIDAD
    if (comprobador == undefined) {
      console.log(comprobador);
      _data.status = 't';
      _data.qtyAux = Number(_cantidad);
      this.comandasUnion.push(_data);
      //console.log("no esta");
    } else {
      // ! SI ESTA, SUMAR LAS CANTIDADES
      console.log('AQUI ESTAAAA', comprobador);
      // console.log("si esta");
      comprobador.status = 't';
      comprobador.qtyAux = Number(comprobador.qtyAux) + Number(_cantidad);
    }
    // ? BORRAR COMANDAS
    this.comandascuentaSecundaria.splice(_index, 1);
    console.log("COMANDAS 1 =>", this.comandascuentaSecundaria);
    console.log("COMANDAS 2 =>", this.comandasUnion);
  }
  /** FUNCION QUE SE ENCARGA DE PASAR LA COMANDA POR CANTIDAD AL OTRO ARRAY**/
  pasarComandaUnion(_comanda, _cantidad) {
    // ! COMPROBAMOS SI ENCUENTRA LA COMANDA
    const comprobador = this.comandasUnion.find((element) => {
      return element.comanda_id == _comanda.comanda_id;
    });
    // ! SI NO ESTA PASAMOS TODA LA CANTIDAD
    if (comprobador == undefined) {
      console.log(comprobador);
      _comanda.status = 's';
      _comanda.qtyAux = Number(_cantidad);
      this.comandasUnion.push(_comanda);

      //console.log("no esta");
    } else {
      // ! SI ESTA, SUMAMOS LA CANTIDAD
      console.log('AQUI ESTAAAA', comprobador);
      // console.log("si esta");
      comprobador.status = 's';
      comprobador.qtyAux = Number(comprobador.qtyAux) + Number(_cantidad);
    }


    console.log("COMANDAS 1 =>", this.comandascuentaSecundaria);
    console.log("COMANDAS 2 =>", this.comandasUnion);
    
    
  }

  /** FUNCION PARA RESTAR LA CANTIDAD DE LA COMANDA SI NO SE PASA TODA **/
  restaCantidadComanda(_comanda: Comanda, cantidad) {
    this.comandascuentaSecundaria.forEach((res) => {
      if (res == _comanda) {
        _comanda.qty = _comanda.qty - cantidad;
        console.log('RESTANDO', res.qty);
      }
    });
  }

  devolverComanda(_data, _index) {
    // ! BUSCAMOS LA COMANDA
    const comprobador = this.comandascuentaSecundaria.find((element) => {
      return element.comanda_id == _data.comanda_id;
    });

    // ! SI NO ESTA, DEVOLVEMOS TODA LA CANTIDAD
    if (comprobador == undefined) {
      console.log(comprobador);
      _data.qty = _data.qtyAux;

      this.comandascuentaSecundaria.push(_data);
    } else {
      // ! SI ESTA, DEVOLVEMOS Y SUMAMOS TODAS LAS CANTIDADES
      // console.log("si esta");
      comprobador.status = 's';
      comprobador.qty = Number(comprobador.qty) + comprobador.qtyAux;
    }
    // ? BORRAR COMANDA
    this.comandasUnion.splice(_index, 1);
    console.log("COMANDAS 1 =>", this.comandascuentaSecundaria);
    console.log("COMANDAS 2 =>", this.comandasUnion);
  }
  /** ENVIAR LOS DATOS AL SERVIDOR PARA GUARDARLOS**/
  async guardarItems() {
    console.log("COMANDA PRINCIPAL AL ENVIAR",this.cuentaPrincipal);
    
    if(this.cuentaPrincipal['comandas'] == null){
      this.cuentaPrincipal['comandas'] = [];
    }
    this.cuentaPrincipal['comandas'] = this.comandascuentaPrincipal;
    this.cuentaSecundaria['comandas'] = this.comandascuentaSecundaria;

    this.comandasUnion.forEach(res=>{
      this.cuentaPrincipal['comandas'].push(res);
    });
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();

    let dataUnirCuentas = {
     recibe: this.cuentaPrincipal,
     envia:  this.cuentaSecundaria
    };
    console.log('JSON PARA ENVIAR', dataUnirCuentas);

    return this.http
      .post(this.apiService.unirCuenta, dataUnirCuentas)
      .subscribe(
        (data) => {
          console.log(data);

          this.http.get(this.apiService.getMesa + this.idMesa).subscribe((data) => {
            this.cuentasSaliendo = data['cuentas'];
            this.modalCtrl.dismiss({
              data: this.cuentasSaliendo,
            });
            loading.dismiss();
          });
        },
        (error) => {
          console.log(error);
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

  // arrastrarComanda(event: CdkDragDrop<string[]>,_num, _index) {
  //   let data = event.previousContainer.data[event.previousIndex];

  //   console.log("comanda", data);
  //   console.log("numero",_num);
  //   console.log(_index);
    
    
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //     if (_num == 2) {
  //       //this.pasarComanda(data);
  //     } else {
  //       //this.devolverComanda(data);
  //     }
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
      this.cuentasSaliendo = data['cuentas'];

      this.modalCtrl.dismiss({
        data: this.cuentasSaliendo,
      });
      loading.dismiss();
    },(error)=>{
      this.modalCtrl.dismiss();
      if (error.error['logout'] == true) {
        this.router.navigate(['/login']);
        this.toast(
          'Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado',
          'danger'
        );
      } else {
        this.toast('Ha ocurrido un error', 'danger');
      }
      loading.dismiss();
    });
  }
}