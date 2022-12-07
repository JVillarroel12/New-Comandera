import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { AlertasMeseroPage } from '../../modals/alertas-mesero/alertas-mesero.page';
import { ModalAnularFacturaPage } from '../../modals/modal-anular-factura/modal-anular-factura.page';
import { ModalFacturacionPage } from '../../modals/modal-facturacion/modal-facturacion.page';
import { ModalGenerarReporteReservacionesPage } from '../../modals/modal-generar-reporte-reservaciones/modal-generar-reporte-reservaciones.page';
import { ModalListReservacionesGlobalesPage } from '../../modals/modal-list-reservaciones-globales/modal-list-reservaciones-globales.page';
import { ModalPreciosPage } from '../../modals/modal-precios/modal-precios.page';
import { ModalReservarZonasMesasPage } from '../../modals/modal-reservar-zonas-mesas/modal-reservar-zonas-mesas.page';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.page.html',
  styleUrls: ['./zonas.page.scss'],
})
export class ZonasPage implements OnInit {
  zonas: any;
  mesas = [];
  user: any;
  nameUser: any;
  mesaStatus: string;
  active: any;
  alertasLlamadas = [];
  comprobarSocket: boolean = false;

  zonasLocalstorage = localStorage.getItem('zonas');
  activarReservaciones = localStorage.getItem('activarReservaciones');
  activarFacturacion = localStorage.getItem('activarFacturacion');
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public ApiService: ApiServiceService,
    public navCtrl: NavController,
    public http: HttpClient,
    public router: Router,
    public loadingCtrl: LoadingController,
    public toastr: ToastController,
    public modalController: ModalController //private socket: Socket
  ) {
    //this.socket.connect();
    this.tema = localStorage.getItem('cambiarTema');
  }

  async ngOnInit() {
  }
  async ionViewWillEnter() {


    this.ApiService.$getUser.subscribe((data) => {
      console.log("USEEERR",data);
      this.user = data;
      this.nameUser = this.user.user_name;
    });
    if (this.user.user_id != undefined) {
      this.actualizarZonasMesas();
    } else {
      if (this.user.user_id == undefined) {
        console.log('NO estas conectado');
        this.router.navigate(['/login'])
        //this.socket.disconnect();
      }
    }
    /** CODIGO PARA OBTENER EL USUARIO**/
  }

  async getZonas() {
    // ! OBTENER ZONAS DEL SERVIDOR
    this.mesas.length = 0;
    /** CODIGO PARA OBTENER LAS ZONAS**/
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();

    this.ApiService.getAllZonas().subscribe(
      (data) => {
        console.log('ZONAAAS', data);
        this.zonas = data;
        localStorage.setItem('zonas', JSON.stringify(data));
        this.active = this.ApiService.actualizarMesas;
        if (this.user.user_id != null) {
          // this.ApiService.getAllCategorias().subscribe((data) => {
          //   console.log("OBTENIENDO categorias",data);
          //   this.ApiService.sendCategorias(data);
          //   localStorage.setItem('categorias', JSON.stringify(data));
          // });
        } else {
          if (this.user.user_id == undefined) {
            //console.log("NO estas conectado");
            //this.socket.disconnect();
            loading.dismiss();
          }
        }
        loading.dismiss();
      },
      (error) => {
        console.log('error', error.error);
        if (error.error['logout'] == true) {
          this.router.navigate(['/login']);
          this.toast(
            'Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado',
            'danger'
          );
        } else {
          this.toast('Ha ocurrido un error', 'danger');
        }
        if (error.error == 'Se acabo el tiempo de espera') {
          this.toast('Ha ocurrido un error al cargar', 'danger');
        }
        loading.dismiss();
      }
    );
  }
  async actualizarZonasMesas(){
    console.log('actualizando mesas', this.ApiService.actualizarMesas);
    if (this.ApiService.actualizarMesas != undefined) {
      this.mesas.length = 0;
      const loading = await this.loadingCtrl.create({
        message: 'Cargando...',
        cssClass: 'spinner',
      });
      loading.present();
      
      this.ApiService.getAllZonas().subscribe(data=>{
        
        this.zonas = data;
        this.active = this.ApiService.actualizarMesas;

        this.zonas.forEach(element => {
          
            element.mesas.forEach(res => {
                if(res['zona_id'] == this.active){
                  this.mesas.push(res);
                  loading.dismiss();
                }
                
            });
        });
      },(error)=>{
        console.log("ERROR =>", error);
        loading.dismiss();
        this.toast("Error obteniendo las zonas", "danger");
      })
    } else {

        this.ApiService.getAllCategorias().subscribe((data) => {
          console.log('OBTENIENDO categorias', data);
          localStorage.setItem('incluyeImpuesto', data.incluye_impuesto);
          this.ApiService.sendCategorias(data);
          localStorage.setItem('categorias', JSON.stringify(data));
          localStorage.setItem('imagenes', JSON.stringify(data.imagenes))
        });
      
      this.getZonas();
    }
  }
  /** FUNCION PARA MOSTRAR LAS MESAS AL HACER CLICK EN UNA ZONA**/
  mostrarMesas(zona, _data) {
    console.log(zona);
    //console.log("ZONA =>",data);
    this.ApiService.actualizarMesas = zona['zona_id'];
    //console.log("mesas",_data);
    this.mesas = _data;
    this.active = zona['zona_id'];
  }
  async abrirAlertas() {
    const modal = await this.modalController.create({
      component: AlertasMeseroPage,

      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
      cssClass: 'modalSeparar',
    });
    await modal.present();
  }
  async abrirModalCaja(){
    const modal = await this.modalController.create({
      component: ModalPreciosPage,
      componentProps:{
        mode: 'caja'      
      },
      cssClass: 'modalPrecios'
    })
    modal.present();
  }
  async modalReservacionZonas(){
    
    const modal = await this.modalController.create({
      component: ModalReservarZonasMesasPage,
      cssClass: 'modalReservacionZonas',
      componentProps: {
        zonas: this.zonas,
        user: this.user,
      }
    });
    await modal.present();
    const reserva = await modal.onDidDismiss();

    if(reserva['data'] != undefined){
      console.log("SI SE CREARON", reserva.data); 
      this.actualizarZonasMesas();
    }
  }
  async reservacionesGlobales(){
    const modal = await this.modalController.create({
      component: ModalListReservacionesGlobalesPage,
      cssClass: 'modalListReservaciones',
      componentProps:{
        user: this.user,
      }
    })
    modal.present();      


  }
  async reporteReservaciones(){
    const modal = await this.modalController.create({
      component: ModalGenerarReporteReservacionesPage,
      cssClass: 'modalReporteReservaciones'
    })

    modal.present();
  }
  async modalAnularFactura(){
    const modal = await this.modalController.create({
      component: ModalAnularFacturaPage,
      cssClass: 'modalAnularFactura'
    })
    modal.present();
  }

  /** LLAMADAS AL MESERO**/

  // alertasMesero(){
  //   this.http.get(this.ApiService.llamadasActivas).subscribe(data=>{
  //     this.alertasLlamadas = data['llamadas'];
  //     //console.log("LLEGANDO POR SERVICIO",this.alertasLlamadas);

  //   });
  //   let listaLlamadasBorradas =[];

  //   // PARA ACCEDER A LAS LLAMADAS
  //   this.socket.on('llamadaDeMesa', (data) => {

  //     //console.log('recibido por socket', data);

  //     //console.log("llegando alertas", this.alertasLlamadas);
  //     this.http.get(this.ApiService.llamadasActivas).subscribe(data=>{
  //       this.alertasLlamadas = data['llamadas'];
  //       //console.log("LLEGANDO POR SERVICIO",this.alertasLlamadas);

  //     });
  //     this.toast("Ha recibido una llamada en una mesa","success");
  //   });

  //   this.socket.on('terminarLlamada', (data) => {
  //     this.toast("Se ha cancelado una llamada","warning");
  //     //console.log('cancelado por socket', data);
  //     this.http.get(this.ApiService.llamadasActivas).subscribe(data=>{
  //       this.alertasLlamadas = data['llamadas'];
  //       //console.log("LLEGANDO POR SERVICIO",this.alertasLlamadas);

  //     });

  //   });

  // }
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
    return this.http.post(this.ApiService.logoutUrl, cerrarSesion).subscribe(
      (data) => {
        loading.dismiss();
        //this.socket.disconnect();
        //console.log("saliendo",this.socket);
        //console.log(data);
        this.router.navigate(['/login']);
      },
      (error) => {
          loading.dismiss();
          if (error.error['logout'] == true) {
            this.router.navigate(['/login']);
            this.ApiService.unsubscribeUser();

            this.toast(
              'Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado',
              'danger'
            );
          } else {
            this.toast('Ha ocurrido un error', 'danger');
            this.router.navigate(['/login']);
            this.ApiService.unsubscribeUser();
          }
        }
      
    );
  }
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
}
