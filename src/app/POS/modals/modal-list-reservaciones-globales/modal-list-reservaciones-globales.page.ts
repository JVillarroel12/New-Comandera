import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-modal-list-reservaciones-globales',
  templateUrl: './modal-list-reservaciones-globales.page.html',
  styleUrls: ['./modal-list-reservaciones-globales.page.scss'],
})
export class ModalListReservacionesGlobalesPage implements OnInit {
  @Input() user;
  reservaciones: any;
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public modalController: ModalController,
    public http: HttpClient,
    public apiService: ApiServiceService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public router: Router
  ) {
    this.tema = localStorage.getItem('cambiarTema');
   }

  async ngOnInit() {
    this.getReservaciones()
  }
  async getReservaciones(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    this.http.get(this.apiService.obtenerReservacionesGlobales).subscribe(res =>{
      this.reservaciones = res;
      console.log("RESERVACIONES GLOBALES =>", res);
      
      this.reservaciones.forEach(element => {
        element.mostrarReservaciones = false;
        let entrada = new Date(element.fecha_entrada);
        let salida =  new Date(element.fecha_salida);
        
        element.transformEntrada = entrada;
        element.transformSalida = salida;
    });
      loading.dismiss();
    },(error)=>{
      console.log("ERROR =>", error.error);
      
      this.toast("Ha ocurrido un error obteniendo las reservaciones", "danger");
      loading.dismiss();
    })
  }

  mostrarReservacionesFun(_data){
    _data.mostrarReservaciones = !_data.mostrarReservaciones;

    console.log("AAAAA =>", _data);
    
  }
  async addCuentaReservacion(_reservacion){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      subHeader: 'Crear cuenta',
      inputs: [
        {
          name: 'numeroCuenta',
          type: 'number',
          placeholder: 'Numero de cuenta',
        },
      ],
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
        {
          text: 'Crear',
          handler: async (data) => {
            const loading = await this.loadingController.create({
              message: 'Cargando...',
              cssClass: 'spinner',
            });
            loading.present();  
            if (this.user.user_id == undefined) {
              this.toast('No se encuentra logueado', 'danger');
              loading.dismiss();
            } else {
                if (data.numeroCuenta < 0) {
                  this.toast('No puede ser un numero menor a 0', 'danger');
                  loading.dismiss();
                } else {
                  if (data.numeroCuenta == '') {
                    this.toast('El campo esta vacio', 'danger');
                    loading.dismiss();
                  } else {
                    if (data.numeroCuenta == undefined) {
                      this.toast('Compuebe que este logueado', 'danger');
                      loading.dismiss();
                    } else {
                      if (data.numeroCuenta > 999) {
                        this.toast(
                          'No puede ser un numero mayor a 3 digitos',
                          'danger'
                        );
                        loading.dismiss();
                      } else {
                        let crearUnaCuenta = {
                          reservacion_id: _reservacion['reservacion_id'],
                          status: '0',
                          mesa_id: _reservacion['mesa_id'],
                          cuenta: data.numeroCuenta,
                          estacion_id: this.user.estacion_id,
                          usuario: this.user.user_id,
                          detalle: ' ',
                          client_id: '0001',
                          name: this.user['user_name'],
                        };
                        console.log("NEUVA CUENTA =>", crearUnaCuenta);
                        
                        return this.http
                          .post(this.apiService.crearCuentaReservacion,crearUnaCuenta).subscribe((data) => {

                              // console.log("id", this.id);
                              console.log('llegando', data);
                              loading.dismiss();    
                              let cuentaCreada = data['datos_cuenta'];
                              console.log('creacioooooon', cuentaCreada);
                              this.modalController.dismiss({
                                data: data,
                              });
                              this.router.navigate([`/comandas/${cuentaCreada.cuenta_id}`]);
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
                  }
                }
              
            }
          },
        },
      ],
    });
    await alert.present();
  }
  verCuenta(data){
    this.router.navigate([`/comandas/${data.cuenta_id}`]);
    this.cerralModal();
  }
  async borrarTodaReservacion(_data){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cancelar reservacion',
      message: 'Esta seguro de que quiere cancelar esta reservacion?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: async (data) => {
            const loading = await this.loadingController.create({
              message: 'Cargando...',
              cssClass: 'spinner',
            });
            loading.present();
            console.log("RESERVACION =>", _data);
              
            let reservacion = {
                reservacion_id: _data.reservacion_id,
                mesa_id: _data.mesa_id
                //user_id: this.user.user_id,
            }
            console.log("BORRAAA =>", reservacion);
            
            this.http.post(this.apiService.cancelarReservacion, reservacion).subscribe(res =>{
              console.log("Res");
              this.toast("Reservacion cancelada con exito", "success");
              this.getReservaciones()
              loading.dismiss();
            },(error)=>{
              console.log("error =>",error.error);
              
              this.toast("Ha ocurrido un error cancelando la reservacion", "danger");
              loading.dismiss();
            })
          }
        }
      ]
    });

    await alert.present();
  }
  /**MENSAJES DE PANTALLA */
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
  cerralModal(){
    this.modalController.dismiss();
  }
}