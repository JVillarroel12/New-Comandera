import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ApiServiceService } from '../../../services/api-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modal-contornos',
  templateUrl: './modal-contornos.page.html',
  styleUrls: ['./modal-contornos.page.scss'],
})
export class ModalContornosPage implements OnInit {

  @Input() data
  contornos = []
  contornosAgregados = []
  dataContornos = {};
  tema = localStorage.getItem('cambiarTema');
  disabledBoton: boolean = true;
  constructor(
    public apiService: ApiServiceService,
    public modalCtrl: ModalController,
    public platform: Platform,
    public location: Location
  ) {
    this.tema = localStorage.getItem('cambiarTema');
   }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10,() => {

      if(this.location.isCurrentPathEqualTo('/modal-contornos')){
        this.modalCtrl.dismiss();
      }
      this.modalCtrl.dismiss();
    });

        console.log("LLEGANDOO",this.data);
        this.dataContornos = this.data
        this.contornos = this.data['contornos'];
        console.log("CONTORNOS", this.contornos);
        
      

      this.disabledBoton = true
  }

  seleccionarContorno(contorno){
    console.log("CONTORNO",contorno);
    
    this.contornosAgregados.push(contorno);

  }

  guardarContornos(){

    console.log("PARA ENVIAR",this.contornosAgregados);


      this.disabledBoton = false;
      this.modalCtrl.dismiss({
        data: this.contornosAgregados
      })
  
    
  }

  eliminarContornoAgregado(data, _index){

    this.contornosAgregados.splice(_index,1);
    
  }

  cerralModal(){
  
        this.modalCtrl.dismiss();
  }
}
