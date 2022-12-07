import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ApiServiceService } from '../../../services/api-service.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-modal-contornos-comanda',
  templateUrl: './modal-contornos-comanda.page.html',
  styleUrls: ['./modal-contornos-comanda.page.scss'],
})
export class ModalContornosComandaPage implements OnInit {
  tema = localStorage.getItem('cambiarTema');
  contornos = []
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

      if(this.location.isCurrentPathEqualTo('/modal-contornos-comanda')){
        this.modalCtrl.dismiss();
      }
      this.modalCtrl.dismiss();
  }); 

    this.apiService.$getContornosComanda.subscribe(data=>{
      console.log(data);      
      this.contornos = data['contorno_comandas']
      console.log("CONTORNOS", this.contornos);
      
    });
  }


  cerralModal(){
  
    this.modalCtrl.dismiss();
  }
}
