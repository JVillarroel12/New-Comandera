import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-modal-generar-reporte-reservaciones',
  templateUrl: './modal-generar-reporte-reservaciones.page.html',
  styleUrls: ['./modal-generar-reporte-reservaciones.page.scss'],
})
export class ModalGenerarReporteReservacionesPage implements OnInit {
  form: FormGroup;
  reporte = null;
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public apiService: ApiServiceService,
    public http: HttpClient,
    public platform: Platform
  ) {
    this.tema = localStorage.getItem('cambiarTema');
   }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      estado: ['', Validators.required],
    })
  }
  formatDate(_value: string) {
    return format(parseISO(_value), 'hh:mm:ss aa yyyy-MM-dd');
  }
  async generarReporte(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    let fechaFin =  new Date(this.form.value['fechaFin']).getTime();
    let fechaEntrada = new Date(this.form.value['fechaInicio']).getTime();
    console.log("FECHAS =>", "FIN =>" + fechaFin + "Inicio =>" + fechaEntrada);
    
    if(fechaFin < fechaEntrada){
      this.toast('Asegurese que la feche de salida sea mayor a la fecha de entrada', "danger");  
      loading.dismiss();
    } else{
      let reporte = {
        fechaInicio: fechaEntrada - 14400000,
        fechaSalida: fechaFin - 14400000,
        estatus: this.form.value['estado']
      }
      console.log("REPORTE =>", reporte);
      
      this.http.post(this.apiService.reporteReservacion, reporte).subscribe(res =>{;
        this.toast("Proceso de impresion completado","success")
        loading.dismiss();
      },(error)=>{
        console.log("ERROR =>",error.error);
        this.toast("Error generando reporte", "danger");
        loading.dismiss();
      })
      
    }
  }

  cuerpoReporte(_data){
    let date = new Date();
    console.log("LLEGANDO =>",_data);
    
    let trasformDate = format(new Date(date), "yyyy-MM-dd  hh:mm aaaaa'm'")
    var rows = [];

    rows.push(['ESTADO', 'CLIENTE', 'RIF', 'ZONA Y MESA', 'MOTIVO', 'F. ENTRADA', 'F. SALIDA']);

    for(let reservacion of _data) {
        if(reservacion.status == "0"){
          reservacion.nombreEstado = "PENDIENTE"
        }
        if(reservacion.status == "1"){
          reservacion.nombreEstado = "EN CURSO"
        }
        if(reservacion.status == "2"){
          reservacion.nombreEstado = "CANCELADO"
        }
        if(reservacion.status == "3"){
          reservacion.nombreEstado = "COMPLETADO"
        }
        if(reservacion.status == "4"){
          reservacion.nombreEstado = "VENCIDO"
        }
          rows.push([reservacion.nombreEstado, reservacion.cliente_nombre, reservacion.rif, reservacion.zona+"-"+reservacion.mesa, reservacion.descripcion, reservacion.fecha_entrada, reservacion.fecha_salida]);

    }

    var pdf = {
      footer: function(currentPage, pageCount) { 
        return [
          
          { 
            fontSize: 10,
            margin: [0,0,10,0],
            text: 'Pagina ' + currentPage + ' de ' + pageCount, 
            alignment:'right'},
            
        ]
      },
      pageOrientation: 'landscape',
      content: [
        // ? ORGANIZATION 


        // ? RIF


        // ? TITLE REPORT
        { text: 'REPORTE DE RESERVACIONES',      
        style: 'header', 

        fontSize: 12,
        bold: true,
        alignment: 'center',
        margin: [0, 10]
        },

        // ? DATE AND USER
        { text: 'Fecha: ' + trasformDate,      
        style: 'header', 

        fontSize: 12,
        alignment: 'right',
        margin: [0, 0]
        },

        {
          fontSize: 11,
          alignment: 'center',
          margin: [0, 10, 0 ,0],
          table: {
                  widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*','*'],
                  body: rows,
                  
              },
              layout: 'lightHorizontalLines'
        }
      ]
    } 
    //this.reporte = pdfMake.createPdf(pdf);

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
