import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ModalRrppPage } from '../modal-rrpp/modal-rrpp.page';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-modal-clave-usuario',
  templateUrl: './modal-clave-usuario.page.html',
  styleUrls: ['./modal-clave-usuario.page.scss'],
})
export class ModalClaveUsuarioPage implements OnInit {
  @ViewChild('input', {static: false}) input: IonInput;
  @Input('') mode;
  tema = localStorage.getItem('cambiarTema');
  formEmpleado: FormGroup;
  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
    public apiService: ApiServiceService,
    public formBuilder: FormBuilder,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.tema = localStorage.getItem('cambiarTema');
    this.formEmpleado = this.formBuilder.group({
      clave: ['', Validators.required]
    })
  }
  ngAfterViewInit(){
    setTimeout(() => {
      this.input.setFocus()
    }, 100);
  }
  searchKeyEmpleado(_event){
    if(_event.charCode == "13"){
      this.buscarEmpleado()
    }
  }
  async buscarEmpleado(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    let data = {
      clave: this.formEmpleado.value.clave.toString()
    }
    console.log("DATA A MANDAR =>", data);
    
    this.http.post(this.apiService.validarPermiso + this.mode, data).subscribe(res=>{
      console.log("RES =>", res);
      loading.dismiss();
      this.modalController.dismiss({
        permiso:res
      })

    },(error)=>{
      this.toast(error.error.message, "danger")
      if(error.error.message){
        this.toast(error.error.message, "danger")
      }else{
        this.toast("Ha ocurrido un error", "danger");
      }
      console.log("ERROR =>", error.error);
      
      loading.dismiss();
    })
  }
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
  cerrarModal(){
    this.modalController.dismiss();
  }
}
