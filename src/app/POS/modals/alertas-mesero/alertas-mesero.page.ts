import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiServiceService } from '../../../services/api-service.service';

@Component({
  selector: 'app-alertas-mesero',
  templateUrl: './alertas-mesero.page.html',
  styleUrls: ['./alertas-mesero.page.scss'],
})
export class AlertasMeseroPage implements OnInit {
  alertasLlamadas = [];
  conteoTiempo: any;
  prueba: boolean;
  constructor(
    public modalCtrl: ModalController,
    public ApiService: ApiServiceService,
    public http: HttpClient
  ) {}

  ngOnInit() {
    /** OBTENE RLAS LLAMADAS ACTIVAS **/
    this.http.get(this.ApiService.llamadasActivas).subscribe((data) => {
      this.alertasLlamadas = data['llamadas'];

      console.log('LLEGANDO POR SERVICIO', this.alertasLlamadas);

      /**LLAMAR A LA FUNCION DE CALCULAR LOS TIEMPOS */
      this.calcularTiempos();
    });
  }
  /** CALCULAR LOS TIEMPOS **/
  calcularTiempos() {
    /**RECORRER LAS LLAMADAS ACTIVAS */
    this.alertasLlamadas.forEach((res) => {
      let tiempoIniciado = res.inicio;
      let tiempoTranscurrido = new Date(Date.now() - tiempoIniciado);
      //console.log(tiempoTranscurrido);
      /**CALCULANDO EL TIEMPO EN SEGUNDOS Y MINUTOS DE LAS LLAMADAS*/
      let seconds = tiempoTranscurrido.getSeconds();
      let sMostrar = seconds > 9 ? seconds : '0' + seconds;

      let minutes = tiempoTranscurrido.getMinutes();
      let mMostrar = minutes > 9 ? minutes : '0' + minutes;

      res.tiempoTranscurrido = mMostrar + ':' + sMostrar;
    });
  }
  cerralModal() {
    this.modalCtrl.dismiss();
  }
}