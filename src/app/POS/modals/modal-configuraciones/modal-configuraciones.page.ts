import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-modal-configuraciones',
  templateUrl: './modal-configuraciones.page.html',
  styleUrls: ['./modal-configuraciones.page.scss'],
})
export class ModalConfiguracionesPage implements OnInit {
  @Input('') mode;
  mostrarReservaciones = false;
  mostrarEstaciones = false;
  mostrarFacturacion = false;
  mostrarTemas = false;
  mostrarIP = false;
  ip: string;
  estaciones:any;
  active: any;
  estacionSeleccionada: any;
  tema = localStorage.getItem('cambiarTema');
  colorTema = localStorage.getItem('cambiarTema');;
  form: FormGroup;
  mostrarMensaje = false;
  constructor(
    private formBuilder: FormBuilder,
    public http: HttpClient,
    public apiService: ApiServiceService,
    public modalController: ModalController
  ) {

   }

  ngOnInit() {

    this.form = this.formBuilder.group({
      activarReservaciones:[localStorage.getItem('activarReservaciones')],
      activarFacturacion: [localStorage.getItem('activarFacturacion')],
      IP: ['']
    });
    if(this.mode == undefined){
      this.mostrarIP = true;
    }else{
      this.mostrarTemas = true;
    }
    this.obtenerEstaciones();

  }

  ngAfterViewInit(){
    this.ip = localStorage.getItem('localIp');
    console.log("IPPPP =>", localStorage.getItem("localIp"));
    console.log("BOOOLEAN =>", this.mostrarMensaje);
    
    if(this.ip == null || this.ip == ''){
      this.mostrarMensaje = true;
    }else{
      this.mostrarMensaje = false;
    }
    console.log("BOOOLEAN DESPUEEES=>", this.mostrarMensaje);
    this.estacionSeleccionada = localStorage.getItem('estacionActiva');
    this.active = localStorage.getItem('estacionActiva');
    
  }
  obtenerEstaciones(){
    let automatico = {
      "name": "AUTOMATICO",
      "estacion_id": ""
    }
    this.http.get(this.apiService.getEstaciones).subscribe(res =>{
      console.log("ESTACIONES =>", res);
      this.estaciones = res;
      this.estaciones.push(automatico);
    },(error)=>{
      console.log("ERROR =>", error);
      
    })
  }
  mostrarElementos(_data){
    if(_data == 'temas'){
      this.mostrarTemas = true;
      this.mostrarFacturacion = false;
      this.mostrarIP = false;
      this.mostrarReservaciones = false;
      this.mostrarEstaciones = false;
    }else{
      if(_data == 'facturacion'){
        this.mostrarFacturacion = true;
        this.mostrarIP = false;
        this.mostrarReservaciones = false;
        this.mostrarEstaciones = false;
        this.mostrarTemas = false;
      }else{
        if(_data == 'ip'){
          this.mostrarIP = true;
          this.mostrarFacturacion = false;
          this.mostrarReservaciones = false;
          this.mostrarEstaciones = false;
          this.mostrarTemas = false;
  
        }else{
          if(_data == 'reservacion'){
            this.mostrarReservaciones = true;
            this.mostrarFacturacion = false;
            this.mostrarEstaciones = false;
            this.mostrarIP = false;
            this.mostrarTemas = false;
  
          }else{
            if(_data == 'estacion'){
              this.mostrarReservaciones = false;
              this.mostrarFacturacion = false;
              this.mostrarEstaciones = true;
              this.mostrarIP = false;
              this.mostrarTemas = false;
  
            }
          }
        }
      }
    }
  }
  seleccionarEstacion(_data){
    
    this.active = _data;
    this.estacionSeleccionada = _data;
    console.log("ESTACION => ",this.estacionSeleccionada);

  }
  cambiarTema(_color, _id){
    console.log("IDD =>", _id);
    var freshMint = document.getElementById('freshMint');
    var summerWine = document.getElementById('summerWine');
    var pinkWine = document.getElementById('pinkWine');
    if(_id == 1){
      freshMint.style.border = "3px solid #fff";
      summerWine.style.border = "none";
      pinkWine.style.border = "none";
    }
    if(_id == 2){
      summerWine.style.border = "3px solid #fff";
      freshMint.style.border = "none";
      pinkWine.style.border = "none";
    }
    if(_id == 3){
      pinkWine.style.border = "3px solid #fff";
      freshMint.style.border = "none";
      summerWine.style.border = "none";
    }
   this.colorTema = _color;
  }
  guardarConfiguracion(){
    
    // ? IP
    if(this.form.value.IP == null || this.form.value.IP == ''){
      localStorage.setItem('localIp', this.ip);
    }else{
      localStorage.setItem('localIp',this.form.value.IP);
    }

    // ?  RESERVACIONES 

    if(this.form.value.activarReservaciones == null){
      localStorage.setItem('activarReservaciones', 'false');
    }else{
      localStorage.setItem('activarReservaciones',this.form.value.activarReservaciones);
    }
    // ? FACTURACION

    if(this.form.value.activarFacturacion == null){
      localStorage.setItem('activarFacturacion', 'false');
    }else{
      localStorage.setItem('activarFacturacion',this.form.value.activarFacturacion);
    }

    // ? ESTACION 

    if(this.estacionSeleccionada == undefined){
      localStorage.setItem('estacionActiva','')
    }else{
      localStorage.setItem('estacionActiva',this.estacionSeleccionada);
    }

    // ? TEMA
    localStorage.setItem('cambiarTema', this.colorTema);
    window.location.reload();
  }
  cerralModal(){
    this.modalController.dismiss();
  }
}
