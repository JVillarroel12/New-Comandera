import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-modal-anular-factura',
  templateUrl: './modal-anular-factura.page.html',
  styleUrls: ['./modal-anular-factura.page.scss'],
})
export class ModalAnularFacturaPage implements OnInit {
  tema = localStorage.getItem('cambiarTema');
  formFactura: FormGroup;
  formComentario: FormGroup;
  factura = {};
  dataFactura = false;
  constructor(
    public formBuilder: FormBuilder,
    public http: HttpClient,
    public apiService: ApiServiceService,
    public modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { 
    this.tema = localStorage.getItem('cambiarTema');
  }

  ngOnInit() {
    this.formFactura = this.formBuilder.group({
      factura: ['']
    });
    this.formComentario = this.formBuilder.group({
      comentario: ['']
    })
  }


  searchKeyFactura(_event){
    if(_event == 13){
      this.searchFactura()
    }
  }
  searchFactura(){
    this.http.get(this.apiService.buscarFactura + this.formFactura.value.factura).subscribe(res=>{
      this.factura = res;
      let date = new Date(this.factura['date_creation']).toUTCString();
      this.factura['auxFecha'] = date;
      console.log("FACTURA =>", this.factura);
      this.dataFactura = true;
      this.toast("Se ha encontrado la factura", "success")
    },(error)=>{
      console.log("ERROR =>", error.error);

      if(error.error.code){
        this.toast(error.error.message, "danger")
      }else{
      this.toast("Error buscando la factura", "danger");
        
      }
      this.dataFactura = false;
    })
  }
  async anularFactura(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    let data = {
      num_factura: this.factura['num_factura'],
      detalle: this.formComentario.value.comentario
    }

    this.http.post(this.apiService.anularFactura, data).subscribe(res =>{
      console.log("RES =>", res);
      this.toast("Factura anulada con exito","success");
      loading.dismiss();
      this.cerrarModal();
      
    },(error)=>{
      console.log("ERROR =>", error.error);
      this.toast("Ha ocurrido un error al intentar anular la factura", "danger");
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
