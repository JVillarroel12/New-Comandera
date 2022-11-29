import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-modal-add-cliente',
  templateUrl: './modal-add-cliente.page.html',
  styleUrls: ['./modal-add-cliente.page.scss'],
})
export class ModalAddClientePage implements OnInit {
  form: FormGroup;
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public apiService: ApiServiceService,
    public loadingController: LoadingController,
    public http: HttpClient,
    public formBuilder: FormBuilder,
    public modalController: ModalController,
    public toastController: ToastController  
  ) { 
    this.tema = localStorage.getItem('cambiarTema');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      selectRif: ['', Validators.required],
      rif: ['', Validators.required],
      telf: ['', Validators.required],
      codTelf: ['']
    })
  }

  async crearCliente(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    
    let cliente = {
      rif: this.form.value['selectRif'] + this.form.value['rif'].replace(/-/g,""),
      name: this.form.value['nombre'],
      telefono: this.form.value['codTelf'] + this.form.value['telf'],
    }
    console.log("CLIENTEE", cliente);
    
    this.http.post(this.apiService.crearCliente, cliente).subscribe(res =>{
      console.log(res);
      this.toast("Se ha creado el cliente correctamente", "success");
      loading.dismiss();
      this.modalController.dismiss({
        data: res,
      });
    },(error)=>{
      this.toast("Error creando el cliente", "danger");
      if(error.error['detalles'] == "CLIENTE YA ESTA REGISTRADO"){
        this.toast(error.error['detalles'], "warning");
      }else{
        this.toast("Error creando el cliente", "danger");
      }
      console.log(error);
      loading.dismiss();
      
    })
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
