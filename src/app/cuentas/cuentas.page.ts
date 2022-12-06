import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AlertasMeseroPage } from '../alertas-mesero/alertas-mesero.page';
import { ModalAddReservaPage } from '../modal-add-reserva/modal-add-reserva.page';
import { ModalCuentasPage } from '../modal-cuentas/modal-cuentas.page';
import { ModalPreciosPage } from '../modal-precios/modal-precios.page';
import { ModalSepararPage } from '../modal-separar/modal-separar.page';
import { ModalTransladarCuentaPage } from '../modal-transladar-cuenta/modal-transladar-cuenta.page';
import { ApiServiceService } from '../services/api-service.service';
import { ModalListReservacionesPage } from '../modal-list-reservaciones/modal-list-reservaciones.page';
import { ModalFacturacionPage } from '../modal-facturacion/modal-facturacion.page';
import { ModalRrppPage } from '../modal-rrpp/modal-rrpp.page';
import { ModalClaveUsuarioPage } from '../modal-clave-usuario/modal-clave-usuario.page';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.page.html',
  styleUrls: ['./cuentas.page.scss'],
})
export class CuentasPage implements OnInit {
  id: any;
  cuentas: any;
  Formcuenta: FormGroup;
  nameUser: any;
  nameMesa: any;
  user: any;
  cuentasSeleccionadas = [];
  mostrarBotonUnir = false;
  filter: any;
  comandasUnidas = [];
  numeroModalCuenta: number;
  mesa = {};
  statusMesa: string;
  alertasLlamadas = [];
  activarReservaciones = localStorage.getItem('activarReservaciones');
  activarFacturacion = localStorage.getItem('activarFacturacion');
  reservaciones: any;
  tema = localStorage.getItem('cambiarTema');

  constructor(
    private activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public fb: FormBuilder,
    public apiService: ApiServiceService,
    public router: Router,
    public loadingCtrl: LoadingController,
    public toastr: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public location: Location
  ) {
    /** FORM PARA OBTENER EL NUMERO DE CUENTA**/
    this.tema = localStorage.getItem('cambiarTema');

  }

  ngOnInit() {
    console.log("CANTIDAAAAD", 1000**-1);
    console.log("RESERVACIONES LOCALSTORAGE =>", this.activarReservaciones);

    this.Formcuenta = this.fb.group({
      numeroCuenta: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(/.*/)]),
      ],
    });
  }

  /** PARA HACER CADA VEZ QUE SE ENTRE A LA PANTALLA**/
  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(10,() => {

      if(this.location.isCurrentPathEqualTo('/cuentas')){
        this.router.navigate(['/zonas'])
      }
      this.router.navigate(['/zonas'])
  }); 


    /** CODIGO PARA OBTENER EL USUARIO LOGUEADO**/
    this.apiService.$getUser.subscribe((data) => {
      console.log("USEEERR",data);
      this.user = data;
      this.nameUser = this.user.user_name;
    });

    if (this.user.user_id != undefined) {
      /** CODIGO PARA OBTENER EL ID DE LA MESA**/
      this.id = this.activatedRoute.snapshot.paramMap.get('id');
      console.log('id', this.id);
      this.getMesa(this.id);
      /** PONER LAS CUENTAS SELECCIONADAS EN 0**/
      this.cuentasSeleccionadas.length = 0;
    } else {
      if (this.user.user_id == undefined) {
        console.log('NO estas conectado');
        this.apiService.unsubscribeUser();

        this.router.navigate(['/login'])
        //this.socket.disconnect();
      }
}
  }
  /** OBTENER EL ID DE LA MESA Y CARGAR LAS CUENTAS**/
  async getMesa(id) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    this.http.get(this.apiService.getMesa + id).subscribe(
      (data) => {
        console.log("MESA =>", data);
        
        this.mesa = data;
        this.apiService.mesaBlock = this.mesa;
        this.statusMesa = this.mesa['status'];
        this.cuentas = data['cuentas'];
        this.nameMesa = data['name'];
        localStorage.setItem('mesaID', id)
        console.log("CUENTAS",this.cuentas);
        loading.dismiss();
      },
      (error) => {
        console.log("ERROR", error.error);
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
  paginaAtras(){
    this.router.navigate(['/zonas'])
  }
  /** FUNCION PARA CREAR UNA CUENTA**/
  pressCrearCuenta(_event){
    if(_event == '13'){
      this.crearCuenta();
    }
  }
  async crearCuenta() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    let numeroCuenta = this.Formcuenta.value.numeroCuenta;
    console.log('IDD', this.id);
    console.log('nombreeee', this.cuentas);
    let crearUnaCuenta = {
      status: '0',
      mesa_id: this.id,
      cuenta: numeroCuenta.toString(),
      estacion_id: this.user.estacion_id,
      usuario: this.user.user_id,
      detalle: ' ',
      client_id: '0000000001',
      name: this.nameUser,
    };
    console.log('CREAR CUENTAAA', crearUnaCuenta);

    if (this.user.user_id == undefined) {
      this.toast('No se encuentra logueado', 'danger');
      loading.dismiss();
    } else {
      if (this.mesa['status'] == '3') {
        this.toast('Esta mesa se encuentra bloqueada', 'danger');
        this.router.navigate(['/zonas'])
        loading.dismiss();
      } else {
        if (numeroCuenta > 999) {
          loading.dismiss();
          this.toast('No puede ser un numero mayor a 3 digitos ', 'danger');
          this.Formcuenta.reset();
        } else {
          if (numeroCuenta < 0) {
            loading.dismiss();
            this.toast('No puede ser un numero menor a 0', 'danger');
            this.Formcuenta.reset();
          } else {
            if (numeroCuenta == '') {
              this.toast('El campo esta vacio', 'danger');
              loading.dismiss();
            } else {
              if (crearUnaCuenta.name == undefined) {
                loading.dismiss();
                this.toast('Compuebe que este logueado', 'danger');
              } else {
                return this.http
                  .post(this.apiService.crearCuentaUrl, crearUnaCuenta)
                  .subscribe(
                    (data) => {
                      console.log("RESPUESTAAA =>", data);
                      
                      let idCuenta = data['cuenta_id'];

                      console.log("IDDDDDDDD", idCuenta);
                      
                      this.id = this.activatedRoute.snapshot.paramMap.get('id');
                      //console.log('id', this.id);
                      this.router.navigate(['/comandas', idCuenta])


                      this.getMesa(this.id);
                      this.Formcuenta.reset();
                      this.toast('Cuenta creada exitosamente', 'success');
                      loading.dismiss();
                    },
                    (error) => {
                      console.log(error.error);
                      if(error.error['logout'] == true){
                        this.router.navigate(['/login']);
                          this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
                        loading.dismiss();
                    }else{
                      if(error.error['detalles'] == 'mesa bloqueada'){
                        loading.dismiss();
                        this.toast('La mesa se encuentra bloqueada', 'danger');
                        this.router.navigate[('/zonas')]
                      }else{

                        loading.dismiss();
                        this.toast('Ha ocurrido un error', 'danger');
                        this.Formcuenta.reset();
                      }
                    }


                    }
                  );
              }
            }
          }
        }
      }
    }
  }

  /** FUNCION PARA ABRIR LA VISTA DE COMANDAS Y CATEGORIAS**/
  abrirCategorias(_data) {
    console.log('dataaaa', _data);

    this.router.navigate(['/comandas']);
    this.apiService.sendCuenta(_data);
  }

  /** FUNCION PARA SELECCIONAR CUENTAS PARA UNIRLAS**/
  seleccionarCuentas(event, _data) {
    if (event.detail.checked == true) {
      this.cuentasSeleccionadas.push(_data);
      console.log('CUENTAS SELECCIONADAS', this.cuentasSeleccionadas);
    } else {
      this.borrarCuenta(this.cuentasSeleccionadas, _data);
    }
  }
  /** FUNCION PARA QUITAR UNA CUENTA SELECCIONADA DEL ARRAY QUE SE ENVIARA PARA UNIRLAS**/
  borrarCuenta(listaCuentas, cuenta) {
    let lista = [];
    let lista2 = [];
    listaCuentas.forEach((res) => {
      if (res == cuenta) {
        lista.push(res);
      } else {
        if (res != cuenta) {
          lista2.push(res);
        }
      }
    });
    this.cuentasSeleccionadas = lista2;
  }
  /** CODIGO PARA ABRIR EL MODAL DE UNIR CUENTAS Y MANDAR EL ARRAY DE CUENTAS SELECCIONADAS**/
  async abrirUnirCuentas() {
    console.log('CUENTAS SELECCIONADAS UNIR', this.cuentasSeleccionadas);
    let cuentas = this.cuentasSeleccionadas;
    if (cuentas.length > 2) {
      this.toast('No puedes seleccionar mas de 2 cuentas', 'danger');
    } else {
      if (cuentas.length <= 1) {
        this.toast('Debes seleccionar al menos dos cuentas', 'danger');
      } else {
        if ((cuentas.length = 2)) {
          const modal = await this.modalCtrl.create({
            component: ModalCuentasPage,
            swipeToClose: true,
            backdropDismiss: true,
            cssClass: 'modalPrecios',
            componentProps:{
              dataCuentas: cuentas,
              idMesa:this.id
            }
          });
          await modal.present();

          const { data } = await modal.onDidDismiss();
          console.log('LLEGANDOOO', data.data);
          if(data.data != undefined){
            this.getMesa(this.id);
          }
          this.cuentas = data.data;
          this.cuentasSeleccionadas.length = 0;
        }
      }
    }
  }
  /** FUNCION PARA CREAR UNA CUENTA AL SEPARAR LA CUENTA SELECCIONADA**/
  async crearCuentaSeparar() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    if (this.cuentasSeleccionadas.length >= 2) {
      this.toast('Solo debes seleccionar una cuenta', 'danger');

    } else {
      if (this.cuentasSeleccionadas.length == 0) {
        this.toast('Debes seleccionar una cuenta', 'danger');
     
      } else {
        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          subHeader: 'Crear nueva cuenta',
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
              handler: (data) => {
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
                      this.Formcuenta.reset();
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
                              status: '0',
                              mesa_id: this.id,
                              cuenta: data.numeroCuenta,
                              estacion_id: this.user.estacion_id,
                              usuario: this.user.user_id,
                              detalle: ' ',
                              client_id: '0000000001',
                              name: this.nameUser,
                            };

                            return this.http
                              .post(this.apiService.crearCuentaUrl,crearUnaCuenta).subscribe((data) => {
                                  this.id =
                                    this.activatedRoute.snapshot.paramMap.get(
                                      'id'
                                    );
                                  // console.log("id", this.id);
                                  this.getMesa(this.id);
                                  console.log('llegando', data);
                                  loading.dismiss();    
                                  let cuentaCreada = data;
                                  console.log('creacioooooon', cuentaCreada);
                                  this.cuentasSeleccionadas.push(cuentaCreada);
                                  console.log(
                                    'AQUI VANN',
                                    this.cuentasSeleccionadas
                                  );

                                  this.abrirModalSepararCuentas(
                                    this.cuentasSeleccionadas
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
                                  this.Formcuenta.reset();
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
    }
  }
  async abrirModalCaja(_data){
    
    const modal = await this.modalCtrl.create({
      component: ModalFacturacionPage,
      cssClass: 'modalFacturacion',
      componentProps: {
        cuenta: _data,
        max_descuento: this.user.max_discount,
        mode: 'cuenta'
      }
    })
    modal.present();
    const facturacion = await modal.onDidDismiss();
    if(facturacion['data'] != undefined){
      this.getMesa(this.id);
    }
  }
  async modalRRPP(_data){
    const modal = await this.modalCtrl.create({
      component: ModalClaveUsuarioPage,
      cssClass: 'modalClaveUsuario',
      componentProps: {
        cuenta: _data,
        mode : 'RRPP'
      }
    })
    modal.present();
    const permiso = await modal.onDidDismiss();
    if(permiso['data'] != undefined){
      const modal = await this.modalCtrl.create({
        component: ModalRrppPage,
        cssClass: 'modalRRPP',
        componentProps: {
          cuenta: _data,
        }
      })
      modal.present();
    }

  }
  /** FUNCIONAR PARA ABRIR EL MODAL Y ENVIAR LA DATA DE SEPARAR CUENTAS**/
  async abrirModalSepararCuentas(_cuentas) {
      console.log("CUENTAS PARA SEPARAR =>", _cuentas);
      
    const modal = await this.modalCtrl.create({
      component: ModalSepararPage,
      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
      cssClass: 'modalSeparar',
      componentProps:{
        idMesa: this.id,
        dataCuentas: _cuentas
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    // console.log("LLEGANDOOO", data.data);
    this.cuentas = data.data;
    if(data.data){
      this.getMesa(this.id)
    }
    this.cuentasSeleccionadas.length = 0;
  }
  async bloquearMesa() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    /**MESA BLOQUEADA */
    if (this.mesa['status'] == '3') {
      let data = {
        mesa_id: this.id,
        status: '0',
      };

      loading.present();
      this.http.put(this.apiService.bloquearMesa, data).subscribe(
        (data) => {
          console.log(data);
          loading.dismiss();
          this.getMesa(this.id);
          this.toast('Mesa desbloqueada exitosamente', 'success');
        },
        (error) => {
          console.log('ERROR=>', error);
          if(error.error['logout'] == true){
            this.router.navigate(['/login']);
            this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
          }else{
            this.toast('Ha ocurrido un error', 'danger');
          }
          loading.dismiss();
        }
      );
    } else {
      /**MESA DESBLOQUEADA */
      if (this.mesa['status'] == '0') {
        let data = {
          mesa_id: this.id,
          status: '3',
        };

        loading.present();
        this.http.put(this.apiService.bloquearMesa, data).subscribe(
          (data) => {
            console.log(data);
            this.getMesa(this.id);
            loading.dismiss();
            this.toast('Mesa bloqueada exitosamente', 'success');
          },
          (error) => {
            console.log('ERROR=>', error);
            loading.dismiss();
            if(error.error['logout'] == true){
              this.router.navigate(['/login']);
              this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
            }else{
              this.toast('Ha ocurrido un error', 'danger');
            }
          }
        );
      }
    }
  }
  async bloquearCuenta(data) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    /**CUENTA BLOQUEADA */
    if (data.status == '2') {
      //PARA DESBLOQUEAR
      let dataCuenta = {
        cuenta_id: data.cuenta_id,
        status: '0',
      };
      this.http.put(this.apiService.bloquearCuenta, dataCuenta).subscribe(
        (data) => {
          console.log(data);
          this.getMesa(this.id);
          this.toast('Cuenta desbloqueada exitosamente', 'success');
          loading.dismiss();
        },
        (error) => {
          console.log('error=>', error);
          if(error.error['logout'] == true){
            this.router.navigate(['/login']);
            loading.dismiss();
            this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
          }else{
            this.toast('Ha ocurrido un error', 'danger');
            loading.dismiss();
          }
        }
      );
      /**CUENTA DESBLOQUEADA */
    } else {
      if (data.status == '0') {
        //PARA BLOQUEAR
        let dataCuenta = {
          cuenta_id: data.cuenta_id,
          status: '2',
        };
        this.http.put(this.apiService.bloquearCuenta, dataCuenta).subscribe(
          (data) => {
            console.log(data);
            this.getMesa(this.id);
            this.toast('Cuenta bloqueada exitosamente', 'success');
            loading.dismiss();
          },
          (error) => {
            console.log('error=>', error);
            if(error.error['logout'] == true){
              this.router.navigate(['/login']);
              loading.dismiss();
              this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
            }else{
              this.toast('Ha ocurrido un error', 'danger');
              loading.dismiss();
            }
          }
        );
      }
    }
  }

  async transladarCuenta(data) {
    if (this.cuentasSeleccionadas.length >= 2) {
      this.apiService.sendTransladarCuenta(this.cuentasSeleccionadas);
    } else {
      this.apiService.sendTransladarCuenta(data);
    }

    const modal = await this.modalCtrl.create({
      component: ModalTransladarCuentaPage,

      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
      cssClass: 'modalSeparar',
    });
    await modal.present();
    const dataTraslado = await modal.onDidDismiss();
    console.log(
      'LLEGANDO A CUENTAS',
      dataTraslado.data['dataTraslado'].cuentas
    );

    this.cuentas = dataTraslado.data['dataTraslado'].cuentas;
    this.getMesa(this.id);
    this.cuentasSeleccionadas.length = 0;
  }

  async verListaReservaciones(){
    const modal = await this.modalCtrl.create({
      component: ModalListReservacionesPage,
      cssClass: 'modalListReservaciones',
      componentProps:{
        mesa: this.mesa,
        user: this.user,
      }
    })
    modal.present();
    const { data } = await modal.onDidDismiss();

    if(data['data'] != undefined){
      this.getMesa(this.id);
    }
  }
  async verPrecios(){
    const modal = await this.modalCtrl.create({
      component: ModalPreciosPage,
      componentProps:{
        mesas: this.mesa,
        mode: 'mesas'      
      },
      cssClass: 'modalPrecios'
    })
    modal.present();
  }
  async addReserva(){
    // if (this.user.user_id == undefined) {
    //   this.toast('No se encuentra logueado', 'danger');
    // }else{
      const modal = await this.modalCtrl.create({
        component: ModalAddReservaPage,
        cssClass: "modalReserva",
        componentProps:{
          mesa: [this.mesa],
          user: this.user,
        }
      })
      modal.present();
      const reserva = await modal.onDidDismiss();
      if(reserva['data'].data != undefined){
        this.getMesa(this.id);
      }
    //}

  }

  async abrirAlertas() {
    const modal = await this.modalCtrl.create({
      component: AlertasMeseroPage,

      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
      cssClass: 'modalSeparar',
    });
    await modal.present();
  }
  async imprimirPreCuenta(_data) {
    console.log("COMANDA =>", _data);
    
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });

    const alert = await this.alertCtrl.create({
      cssClass: 'preCuenta',
      message: 'Estas seguro de que quieres imprimir una pre-cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Si',
          handler: () => {
            loading.present();
            console.log('Confirm Okay');
              this.http.get(this.apiService.pedirPreCuenta + _data.cuenta_id).subscribe(
                (data) => {
                  console.log(data);
                  loading.dismiss();
                  this.toast("Proceso de impresion completado", "success");
                },
                (error) => {
                  console.log(error);
                  this.toast(error.error.message, "danger");
                  loading.dismiss();
                }
              );

          },
        },
      ],
    });

    await alert.present();
  }
  /*alertasMesero(){
    this.http.get(this.apiService.llamadasActivas).subscribe(data=>{
      this.alertasLlamadas = data['llamadas'];
      console.log("LLEGANDO POR SERVICIO",this.alertasLlamadas);
      
    });
    let listaLlamadasBorradas =[];
    //this.socket.connect();
    // PARA ACCEDER A LAS LLAMADAS
    this.socket.on('llamadaDeMesa', (data) => {

      console.log('recibido por socket', data);

      console.log("llegando alertas", this.alertasLlamadas);
      this.http.get(this.apiService.llamadasActivas).subscribe(data=>{
        this.alertasLlamadas = data['llamadas'];
        console.log("LLEGANDO POR SERVICIO",this.alertasLlamadas);
        
      });
      this.toast("Ha recibido una llamada en una mesa","success");
    });

    this.socket.on('terminarLlamada', (data) => {
      this.toast("Se ha cancelado una llamada","warning");
      console.log('cancelado por socket', data);
      this.http.get(this.apiService.llamadasActivas).subscribe(data=>{
        this.alertasLlamadas = data['llamadas'];
        console.log("LLEGANDO POR SERVICIO",this.alertasLlamadas);
        
      });

    });

  }*/
  /** MENSAJES DE RESPUESTA EN EL TOP**/
  async toast(msg, status) {
    const toast = await this.toastr.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 3000,
      cssClass: 'toastCss',
    });
    toast.present();
  }

  /** CERRAR SESION**/
  async cerrarSesion() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    let cerrarSesion = {
      user_id: this.user.user_id,
    };
    return this.http
      .post(this.apiService.logoutUrl, cerrarSesion)
      .subscribe((data) => {
        //this.socket.disconnect();
        console.log(data);
        loading.dismiss();
        this.router.navigate(['/login']);
        this.apiService.unsubscribeUser();

      },(error)=>{
        loading.dismiss();
        this.router.navigate(['/login']);
        this.apiService.unsubscribeUser();

      });
  }
}