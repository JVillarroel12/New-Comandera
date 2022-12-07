import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { ModalAddClientePage } from '../modal-add-cliente/modal-add-cliente.page';
import { ApiServiceService } from '../../../services/api-service.service';
@Component({
  selector: 'app-modal-add-reserva',
  templateUrl: './modal-add-reserva.page.html',
  styleUrls: ['./modal-add-reserva.page.scss'],
})
export class ModalAddReservaPage implements OnInit {
  @Input() mesa;
  @Input() user;
  formRif: FormGroup;
  form: FormGroup;
  birthdayValue = false;
  nombreCliente: string;
  numeroCliente: string;
  cliente: any;
  mensaje = ``;
  urlMsgWhatsapp = "https://wa.me/";
  logoImg : string;
  tipoReservaciones:any;
  tema = localStorage.getItem('cambiarTema');
  constructor(
    private formBuilder: FormBuilder,
    public apiService: ApiServiceService,
    public http: HttpClient,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public router: Router,
    public alertController: AlertController
  ) { 
    this.logoImg = '/assets/img/CDBLEU.png';
    this.tema = localStorage.getItem('cambiarTema');
  }

  ngOnInit() {
    this.obtenerReservaciones();
    this.formRif = this.formBuilder.group({
      rif: ['', Validators.required],
    })
    this.form = this.formBuilder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      cantAdultos: ['', Validators.required],
      cantNinos: ['',Validators.required],
      tipoReservacion: ['', Validators.required],
      comentario: [''],
      telf: ['', Validators.required]
    })
  }
  formatDate(_value: string) {
    console.log(_value);
    
    return format(parseISO(_value), 'hh:mm:ss aa yyyy-MM-dd');
  }
  /**BUSCAR UN CLIENTE */
  async buscarCliente(_event){
    if (_event == 13) {
      let rif =  this.formRif.value['rif'].replace(/-/g,"");
      console.log(rif);
      
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        cssClass: 'spinner',
      });
      loading.present();
      
      this.http.get(this.apiService.pedirCliente + rif).subscribe(res =>{
           this.cliente = res;
           console.log("CLIENTEEEE =>", this.cliente);
           this.nombreCliente = res['name'];
           this.numeroCliente =res['telefono'];       
           this.toast('Se ha encontrado el cliente', 'success')

        loading.dismiss();
      },(error)=>{
        console.log(error.error);
        if(error.error.code = 404){
          this.agregarCliente();
          this.toast('No se ha encontrado el cliente', 'warning');
          loading.dismiss();
        }else{
          this.toast('Error encontrando el cliente', 'danger');
          loading.dismiss();
        }

      })
    }
  }
  /**AGREGAR UN CLIENTE */
  async agregarCliente(){
    const modal = await this.modalController.create({
      component: ModalAddClientePage,
      cssClass: "modalAddCliente"
    })
    await modal.present();

    const cliente = await modal.onDidDismiss();
    console.log('SALIENDO', cliente['data'].data);
    this.cliente = cliente['data'].data;
    this.nombreCliente = cliente['data'].data.name;
    this.numeroCliente = cliente['data'].data.telefono;
  }
  /** AGREGAR UNA RESERVACION */
  async agregarReservacion(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    console.log("FECHA ENTRADA PRIMERO", this.form.value['fechaInicio']);
    console.log("FECHA SALIDA PRIMERO", this.form.value['fechaFin']);
    
    
    let fecha_entrada = new Date(this.form.value['fechaInicio']).getTime();
    let fecha_salida = new Date(this.form.value['fechaFin']).getTime();
    console.log("FECHA ENTRADA SALIENDO =>", fecha_salida , " FECHA ENTRADA =>", fecha_entrada);
    if(fecha_salida < fecha_entrada){
      this.toast('Asegurese que la feche de salida sea mayor a la fecha de entrada', "danger");  
    }else{
      let idMesas = [];
      this.mesa.forEach(element => {
        idMesas.push(element.mesa_id)
      });
      
      //loading.present();
      let reserva = {  
          user_id: this.user['user_id'],
          cliente_id: this.cliente['client_id'],
          reservacion_lugar: idMesas,
          fecha_entrada: (fecha_entrada) - 14400000,
          fecha_salida: (fecha_salida) - 14400000,
          adultos: this.form.value['cantAdultos'],
          menores: this.form.value['cantNinos'],
          comentario: this.form.value['comentario'],
          telefono: this.form.value['telf'].toString(),
          tipo_reservacion: this.form.value['tipoReservacion']
      }  
      console.log("RESERVACION =>", reserva);
      this.numeroCliente = this.form.value['telf'];
      let msgMesas = "";
      if(this.mesa.length > 1){
        msgMesas = "en varias mesas"
      }else{
        msgMesas = `para la mesa ${this.mesa[0].name}`;
      }
      this.http.post(this.apiService.crearReserva, reserva).subscribe(res=>{
        this.mensaje = `Hola ${res['cliente']}, haz realizado una reservacion en ${res['empresa']} ${msgMesas} correspondiente a la zona ${res['zona']} con fecha de entrada ${this.form.value['fechaInicio']}, hasta las ${this.form.value['fechaFin']}.`;
        
        //window.location.href = this.urlMsgWhatsapp+this.numeroCliente+`?text=${this.mensaje}`;
        this.toast("Se ha creado la reservacion correctamente", "success");
        loading.dismiss();
        
        this.modalController.dismiss({
          data: res,
        });
  
      },(error)=>{
        console.log(error);
        this.toast("Error creando la reservacion", "danger")
        loading.dismiss();
      })
    }

  }
  async obtenerReservaciones(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();

    this.http.get(this.apiService.tipoReservacion).subscribe(res=>{
      console.log("tipoReservaciones",res);
      this.tipoReservaciones = res;
      loading.dismiss();
    },(error)=>{
      console.log(error);
      loading.dismiss();
      this.toast("Error obteniendo los tipos de reservacion", "danger")
    })
  }
  async agregarTipoReservacion(){

     const alert = await this.alertController.create({
       cssClass: 'my-custom-class',
       header: 'Crear tipo de reservacion',
       inputs: [
         {
           name: 'nombre',
           type: 'text',
           placeholder: 'Nombre'
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
           handler: async (nombre) => {
            const loading = await this.loadingController.create({
              message: 'Cargando...',
              cssClass: 'spinner',
            });
            loading.present();
             let data = {
               descripcion: nombre.nombre
             }
             console.log("NUEVA RESERVACION =>",data);
             
             this.http.post(this.apiService.tipoReservacion, data).subscribe(res=>{
               console.log(res);
               this.obtenerReservaciones();
               loading.dismiss();
             },(error)=>{
               console.log(error.error)
               this.toast("Error creando un nuevo tipo de reservacion","danger");
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
