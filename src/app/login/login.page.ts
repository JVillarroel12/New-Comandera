import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../services/api-service.service';
import { ModalFacturacionPage } from '../modal-facturacion/modal-facturacion.page';
import { ModalConfiguracionesPage } from '../modal-configuraciones/modal-configuraciones.page';
import { ModalDescuentoFacturarPage } from '../modal-descuento-facturar/modal-descuento-facturar.page';
import { ModalDescuentoFacturarPageModule } from '../modal-descuento-facturar/modal-descuento-facturar.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('passwordEyeRegister', { read: ElementRef })
  passwordEye: ElementRef;
  formLogin: FormGroup;
  status: string = '';
  conectionType: string = '';
  passwordTypeInput = 'password';
  comprobarSocket: boolean = false;
  blockIp:number = 0;
  activarRes: number = 0;
  logoImg : string;
  numero = 10;
  tema = localStorage.getItem('cambiarTema');
  prueba = [
    {
      "name": "feo"
    },
    {
      "name": "fea"
    },
    {
      "name": "culo"
    },
  ]
  constructor(
    public fb: FormBuilder,
    public router: Router,
    public http: HttpClient,
    public apiService: ApiServiceService,
    public loadingCtrl: LoadingController,
    public toastr: ToastController,
    public platform: Platform,
    public location: Location,
    public alertController: AlertController,
    public modalController: ModalController
  ) //public socket: Socket

  {
    this.formLogin = this.fb.group({
      //usuario:['', Validators.required],
      psw: ['', Validators.required],
    });
    this.tema = localStorage.getItem('cambiarTema');
    this.logoImg = '/assets/img/CDBLEU.png';

    console.log("TEMA =>", this.tema);
    if(this.tema == null){
      localStorage.setItem('cambiarTema', 'freshMint');
      this.tema = localStorage.getItem('cambiarTema');

    }
    
  }

  async ngOnInit() {
    // let data = 
    //   {"cmd":"facturar","serial":null,"factura":{"cliente":{"nombre":"Jaime Villarroel","rif":"V28468368"},"cabecera":[],"pie":["BARRA 1 GRACIAS POR PREFERIRNOS"],"notaFiscal":null,"items":[{"codigo":"BAQ012","producto":"BOLITAS DE CARNE","precio":12.8276,"cantidad":10,"tasa":"G","descuento":0,"tipo_descuento":"","texto":""},{"codigo":"BAQ005","producto":"BROCHETAS DE CAPRESA","precio":8.75864,"cantidad":1,"tasa":"G","descuento":0,"tipo_descuento":"","texto":""},{"codigo":"BAQ002","producto":"BROCHETAS DE LOMITO","precio":13.1724,"cantidad":1,"tasa":"G","descuento":0,"tipo_descuento":"","texto":""},{"codigo":"BAQ013","producto":"CROQUETAS DE PESCADO","precio":19.72416,"cantidad":1,"tasa":"G","descuento":0,"tipo_descuento":"","texto":""},{"codigo":"BAQ016","producto":"DADOS DE POLLO Y POLENTA","precio":4.8276,"cantidad":10,"tasa":"G","descuento":0,"tipo_descuento":"","texto":""},{"codigo":"","producto":"SERVICIO (10,00%)","precio":21.82072,"cantidad":1,"tasa":"E","descuento":0,"tipo_descuento":"","texto":""}],"pagos":[{"monto":500,"metodo":"T.CREDITO","metodo_id":1,"impuesto":null}],"descuento":{"tipo_descuento":"","descuento":0}},"textoNFF":null,"textoNF":null,"reimprimir":null}
    
    //   this.http.post("http://192.168.123.70:5500/printer", data).subscribe(res=>{
    //     console.log(res);
        
    //   },(error)=>{
    //     console.log(error);
        
    //   })
  }
  ionViewWillEnter() {
    this.blockIp = 0;
    this.platform.backButton.subscribeWithPriority(10,() => {

      if(this.location.isCurrentPathEqualTo('/login')){
        navigator['app'].exitApp();
      }
      
  }); 
    this.formLogin.value.psw = '';
    this.apiService.actualizarMesas = undefined;
    //this.socket.disconnect();
  }
  async changeIp(){

    this.blockIp++;

     if(this.blockIp == 3){
      this.blockIp = 0;
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Cambiar ip',
        inputs: [
          {
            name: 'ip',
            type: 'text',
            placeholder: 'Ej: 192.168.123.99:4000'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: 'Guardar',
            handler: (data) => {
              console.log(data);
              localStorage.setItem('localIp',data.ip)
              this.blockIp = 0;
              window.location.reload();
            }
          }
        ]
      });
  
      await alert.present();
     }
  }
  async modalConfiguraciones(){
    const modal = await this.modalController.create({
      component: ModalConfiguracionesPage,
      cssClass: 'modalConfiguraciones',
      componentProps: {
        mode: 'user'
      }
    })
    modal.present();
  }
  async abrirModalConfiguracionesAdmin(){
    this.blockIp++;

    if(this.blockIp == 3){
      const modal = await this.modalController.create({
        component: ModalConfiguracionesPage,
        cssClass: 'modalConfiguraciones'
      })
      this.blockIp = 0;
      modal.present();
    }
  }
  async activarReservaciones(){
    this.activarRes++;

     if(this.activarRes == 3){
      this.activarRes = 0;
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Configuraciones',
        inputs: [
          {
            type: 'checkbox',
            name: 'reservaciones',
            label: 'Activar Reservacion'/*this.prueba.map(n => n.name).join(',')*/,
            value: 'si'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: 'Guardar',
            handler: (data:any) => {
              console.log(data);
              localStorage.setItem('activarReservaciones',data)
              this.activarRes = 0;
              //window.location.reload();
            }
          }
        ]
      });
  
      await alert.present();
     }
  }
  /** FUNCION PARA HACER LOGIN**/
  async enviar(_event?) {
    console.log(this.apiService.IP);    
    if (_event == 13) {
      const loading = await this.loadingCtrl.create({
        message: 'Cargando...',
        cssClass: 'spinner',
      });
      loading.present();
      let user = {
        clave: this.formLogin.value.psw,
        tipo: 'tablet',
        estacion_id: localStorage.getItem('estacionActiva')
      };
      console.log("LOGEANDOME USER =>", user);
      
      this.http.post(this.apiService.loginUrl, user).subscribe(
        (dataLogin) => {
          console.log('LA DATA QUE ESTA LLEGANDO', dataLogin);

          if (dataLogin['datos'].error == 'Usuario no encontrado') {
            console.log('USUARIO NO ENCONTRADO');

            this.toast('Usuario no registrado', 'danger');
          } else {
            if (dataLogin['pasa'] == false) {
              this.toast(
                'Espere a que la sesion se cierre correctamente',
                'danger'
              );
              console.log('NO HA CERRADO LA SESION');
            } else {
              if (dataLogin['datos'].user_id != null) {

                console.log('ENCONTRO EN USUARIO');
                this.comprobarSocket = true;
                this.apiService.sendUser(dataLogin);
                this.router.navigate(['/zonas']);
                this.toast('Bienvenido ' + dataLogin['datos'].user_name, 'success');
                this.apiService.sendUser(dataLogin['datos']);
                this.formLogin.reset();
                loading.dismiss();
                console.log(dataLogin);
                // });
              }
            }
          }
        },
        (error) => {
          console.log('ERRORRRRRRRRRRRRRRR', error);
          this.formLogin.reset();
          console.log(error);
          let text= ""
          if(error.error.code == "401"){
            text = error.error['message'];
          }else{
            text = "Ha ocurrido un error";
          }
          loading.dismiss();
            this.toast(text, 'danger');     
        }
      );
    }
  }

  ocultarClave() {
    //cambiar tipo input
    this.passwordTypeInput =
      this.passwordTypeInput === 'text' ? 'password' : 'text';
    //obtener el input
    const nativeEl = this.passwordEye.nativeElement.querySelector('input');
    //obtener el indice de la posición del texto actual en el input
    const inputSelection = nativeEl.selectionStart;
    //ejecuto el focus al input
    nativeEl.focus();
    //espero un milisegundo y actualizo la posición del indice del texto
    setTimeout(() => {
      nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);
  }

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


  async abrirModalCaja(){
    const modal = await this.modalController.create({
      component: ModalFacturacionPage,
      cssClass: 'modalFacturacion'
    })
    modal.present();
  }
}
