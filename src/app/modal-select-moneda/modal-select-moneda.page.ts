
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal-select-moneda',
  templateUrl: './modal-select-moneda.page.html',
  styleUrls: ['./modal-select-moneda.page.scss'],
})
export class ModalSelectMonedaPage implements OnInit {
  @ViewChild('input', {static: false}) input: IonInput;
  @Input() pago;
  @Input() total;
  @Input() tasa;
  @Input() totalDolar;
  tema = localStorage.getItem('cambiarTema');
  formMetodoPago: FormGroup;
  montoDolares: FormGroup;
  valueMonto: number;
  auxValueMonto:number;
  IGTF = false;
  igtfDolar: number;
  igtfBs: number;
  pagoDolares = false;
  cantDolares = 0;
  constructor(
    private navCtrl: NavController,
    public modalController: ModalController,
    public formBuilder: FormBuilder,
  ) { 
    this.tema = localStorage.getItem('cambiarTema');

  }

  ngOnInit() {

    this.formMetodoPago = this.formBuilder.group({
      monto: ['', Validators.required]
    });
    this.montoDolares = this.formBuilder.group({
      dolares: ['']
    })
  }
  ngAfterViewInit(){
    console.log("aaaaaaaaaaaaaaaaaa =>", this.total);
    
    setTimeout(() => {
      this.input.setFocus();
      
      if(this.pago.tipo == "US" || this.pago.tipo == "AN" || this.pago.tipo == "ZE"){
        this.pagoDolares = true;
        let auxMonto:number = 0;
        auxMonto = this.total / this.tasa;
        this.valueMonto = Number(auxMonto.toFixed(2));
      }else{
        this.valueMonto = this.total.toFixed(2);
        this.cantDolares = this.valueMonto / this.tasa;
        this.cantDolares = Number(this.cantDolares.toFixed(2));
      }
      console.log("TOTAL =>", this.valueMonto);


      let pago = this.pago['descripcion'];
      if(pago.includes("DIVISA") || pago.includes("divisa") || pago.includes("Divisa")){
        this.IGTF = true;
      }else{
        this.IGTF = false;
      }
      if(this.IGTF){
        let auxIGTFBS = this.total * (3) / 100;

        this.igtfDolar = auxIGTFBS / this.tasa;

        this.igtfBs = auxIGTFBS ;
        
      }else{
        this.igtfBs = 0;
      }
      this.auxValueMonto = this.total;
      
    }, 300);    

  }
  pressMonto(_event, _mode){

    let teclas = _event.keyCode;

    setTimeout(() => {

      if(this.formMetodoPago.value.monto == this.totalDolar){
        this.auxValueMonto = this.total;
      }else{
        this.auxValueMonto = this.formMetodoPago.value.monto * this.tasa;    

      }
      if(_mode == '1'){
        this.cantDolares = this.formMetodoPago.value.monto / this.tasa;
        this.cantDolares = Number(this.cantDolares.toFixed(2))
      }else{
        if(_mode == '2'){
     
          this.input.value = 0;
          this.valueMonto = 0;
          this.formMetodoPago.value.monto = 0;
          this.valueMonto = this.montoDolares.value.dolares * this.tasa;
          this.valueMonto = Number(this.valueMonto.toFixed(2));
          console.log("montoooooo =>", this.valueMonto);
          
          this.input.value = this.valueMonto;
        }

      }

      if(this.IGTF){
        let auxIGTFBS = this.auxValueMonto * (3) / 100;

        this.igtfDolar = auxIGTFBS / this.tasa;
        console.log("1111111111111", this.igtfDolar);
        console.log("22222222222222", auxIGTFBS);

        
        this.igtfBs = Math.round(auxIGTFBS*100)/100 ;
        console.log("TOTAL =>", this.igtfBs);
        
      }else{
        this.igtfBs = 0;
      }
    }, 50);
    if(teclas == '13'){
      this.guardarMetodoPago();
    }
  }

  guardarMetodoPago(){
    if(this.IGTF){

      let auxIGTFBS = this.auxValueMonto * (3) / 100;

      this.igtfDolar = auxIGTFBS / this.tasa;
      console.log("1111111111111", this.igtfDolar);
      console.log("22222222222222", auxIGTFBS);

      
      this.igtfBs = Math.round(auxIGTFBS*100)/100 ;
      console.log("TOTAL =>", this.igtfBs);
      
    }else{
      this.igtfBs = 0;
    }
    let data = {     
        descripcion: this.pago.descripcion,
        instr_id: this.pago.metodo_pago_id,
        monto: this.formMetodoPago.value['monto'],
        auxMontoBs: this.auxValueMonto, 
        simbolo: this.pago.simbolo,
        tipo: this.pago.tipo,
        igtf: this.igtfBs    
    }
    this.modalController.dismiss({
      data: data,
    });
    console.log("GUARDANDOOO",data); 
  }

  cerralModal(){
    this.modalController.dismiss();
  }
}
