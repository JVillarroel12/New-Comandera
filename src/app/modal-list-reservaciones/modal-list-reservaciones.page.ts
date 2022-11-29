import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-modal-list-reservaciones',
  templateUrl: './modal-list-reservaciones.page.html',
  styleUrls: ['./modal-list-reservaciones.page.scss'],
})
export class ModalListReservacionesPage implements OnInit {
  @Input() mesa;
  @Input() user;
  reservaciones :any;
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public apiService: ApiServiceService,
    public modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public http: HttpClient,
    public alertController: AlertController,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) { 
    this.tema = localStorage.getItem('cambiarTema');
  }

  ngOnInit() {
    console.log("MESA =>", this.mesa);
    console.log("USER =>", this.user);
    
    this.getReservaciones(this.mesa['mesa_id'])
  }
  async getReservaciones(_id){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();  

    this.http.get(this.apiService.obtenerReservaciones + _id).subscribe(res=>{
      
      this.reservaciones = res;
      console.log("RESERVACIONES", this.reservaciones);
      this.reservaciones.forEach(element => {
          let entrada = new Date(element.fecha_entrada);
          let salida =  new Date(element.fecha_salida);
          console.log("ENTRADA =>", entrada + "SALIDA =>", salida);
          
          element.transformEntrada = entrada;
          element.transformSalida = salida;
      });
      
      loading.dismiss();
    },(error)=>{
      this.toast("Error obteniendo las reservaciones", "danger");
      loading.dismiss();
    })
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
              if (this.mesa['status'] == '3') {
                this.toast('Esta mesa se encuentra bloqueada', 'danger');
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
                          mesa_id: this.mesa['mesa_id'],
                          cuenta: data.numeroCuenta,
                          estacion_id: this.user.estacion_id,
                          usuario: this.user.user_id,
                          detalle: ' ',
                          client_id: '0001',
                          name: this.user['user_name'],
                        };
                        console.log("NEUVA CUENTA =>", crearUnaCuenta);
                        
                        return this.http
                          .post(this.apiService.crearCuentaReservacion + _reservacion['reservacion_id'],crearUnaCuenta).subscribe((data) => {

                              // console.log("id", this.id);
                              console.log('llegando', data);
                              loading.dismiss();    
                              let cuentaCreada = data['datos_cuenta'];
                              console.log('creacioooooon', cuentaCreada);
                              this.modalController.dismiss({
                                data: data,
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
  async borrarReservacion(_data){
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
                user_id: this.user.user_id,
                mesa_id: _data.mesa_id
            }
            this.http.post(this.apiService.cancelarReservacion, reservacion).subscribe(res =>{
              console.log("Res");
              this.toast("Reservacion cancelada con exito", "success");
              this.getReservaciones(this.mesa['mesa_id'])
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
        duration: 2000,
        cssClass: 'toastCss',
      });
      toast.present();
    }
  
    cerralModal(){
      this.modalController.dismiss();
    }
}
