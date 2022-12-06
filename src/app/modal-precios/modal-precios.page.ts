import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ModalContornosComandaPage } from '../modal-contornos-comanda/modal-contornos-comanda.page';
import { ModalContornosGeneralesPage } from '../modal-contornos-generales/modal-contornos-generales.page';
import { ModalContornosPage } from '../modal-contornos/modal-contornos.page';
import { ModalFacturacionPage } from '../modal-facturacion/modal-facturacion.page';
import { ModalOpcionComandasPage } from '../modal-opcion-comandas/modal-opcion-comandas.page';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-modal-precios',
  templateUrl: './modal-precios.page.html',
  styleUrls: ['./modal-precios.page.scss'],
})
export class ModalPreciosPage implements OnInit {
  @ViewChild('btnGuardarComandas') btnGuardarComandas: ElementRef;
  @Input() mesas;
  @Input() mode;
  search = '';

  comandas: any[] = [];
  imagenes = [];
  comandasPorGuardar = [];
  categorias: any[] = [];
  categoriasHijo = [];
  conversiones: any;
  categoriasVolver = [];
  respuestaContornosGenerales: any;

  productos: any[] = [];

  menuCategoria = [];

  cuenta: any;
  devolver: boolean = false;
  OcultarProductos: boolean = false;
  textoBuscar = '';

  nameMesa: any;
  nameUser: any;
  user: any;
  cantidadComanda: any;
  id: any;
  obtenerCategorias = localStorage.getItem('categorias');
  incluyeImpuesto:any;

  precioTotal = 0;
  precioTotalDollar = 0;

  statusCuenta: string;

  alertasLlamadas = [];
  tema = localStorage.getItem('cambiarTema');
  constructor(
    public apiService: ApiServiceService,
    public http: HttpClient,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastr: ToastController,
    public loadingCtrl: LoadingController,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { 
    this.tema = localStorage.getItem('cambiarTema');
  }

  ngOnInit() {
    this.funcionObtenerCategorias();
    this.pedirConversion();
    
    
    this.apiService.$getUser.subscribe((data) => {
      // console.log("USEEERR",data);
      this.user = data;
      this.nameUser = this.user.user_name;
    });
  }
  funcionObtenerCategorias() {
    var transformarCategorias = JSON.parse(this.obtenerCategorias);
    this.categorias = transformarCategorias.categorias;
    this.imagenes = transformarCategorias.imagenes;

    this.categorias.forEach(res=>{

      this.imagenes.forEach(element=>{
        if(res.image_id == element.image_id){
          res.imagen = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+element.picture);
        }
      })
    });

    this.incluyeImpuesto = localStorage.getItem('incluyeImpuesto')
    this.menuCategoria.length = 0;
    console.log('categoriaaas', this.categorias);
  }
  async abrirCategoria(data) {
    console.log("ABRIENDO CATEGORIA =>", data);
    
    this.categorias = data['categorias'];
    if(this.categorias != null){
      this.categorias.forEach(res=>{

        this.imagenes.forEach(element=>{
          if(res.image_id == element.image_id){
            res.imagen = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+element.picture);
          }
        })
      });
    }

    this.mostrarMenuCategorias(data);

    this.productos = data['productos'];
    if(this.productos != null){
      this.productos.forEach(res=>{

        this.imagenes.forEach(element=>{
          if(res.image_id == element.image_id){
            res.imagen = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+element.picture);
          }
        })
      });
    }
    if(data['productos'] != null){
      this.productos.forEach(res=>{
        let ivaDolar = 0;
        let ivaBolivares = 0;
        let auxPriceDolar = Number(res.price3);
        let auxPriceBolivares = Number(res.price1);
        if(this.incluyeImpuesto == "1"){
           ivaDolar = Number(res.price3)*(res.iva/100);
           ivaBolivares = Number(res.price1)*(res.iva/100);
        }

        res.price3Aux = auxPriceDolar + ivaDolar;
        res.price1Aux = auxPriceBolivares + ivaBolivares
      });
    }
 
    var aObjeto = {};
    let array = [];

    try {
      this.menuCategoria.forEach(function (res) {
        //console.log("hola",res);
        array.push(res);
        if (res === data) throw aObjeto;
      });
    } catch (e) {
      if (e !== aObjeto) throw e;
    }

    console.log('ARRAY NUEVO', array);
    this.menuCategoria = array;
  }
  /** FUNCION QUE SE ENCARGA DE AGREGAR AL MENU LAS CATEGORIAS SELECCIONADAS**/
  async mostrarMenuCategorias(_data) {
    //console.log("llegando data",_data);

    if (this.menuCategoria.length == 0) {
      this.menuCategoria.push(_data);
      //console.log("enviando al menu",this.menuCategoria);
    } else {
      if (this.menuCategoria.length > 0) {
        const comprobador = this.menuCategoria.find((element) => {
          return element == _data;
        });
        //console.log(comprobador);

        if (comprobador == undefined) {
          //console.log(comprobador);
          this.menuCategoria.push(_data);

          //console.log("no esta");
        } else {
          //console.log(comprobador);
          // console.log("si esta");
        }
      }
    }
  }
  /** FUNCION PARA IR AL HOME DE **/
  devolverCategorias() {
    this.search = '';
    this.funcionObtenerCategorias();
    this.devolver = false;
    this.productos.length = 0;
    this.menuCategoria.length = 0;
  }
  async crearComanda(_data) {
    console.log('PRODUCTOOO', _data);
    if (_data.contornos.length == 0) {
      let crearComanda = {
        cuenta_id: '',
        product_id: _data.producto_id,
        category_id: _data.categoria_id,
        name: _data.name.replace(/[']+/g, ''),
        pricebase: Number(_data.price1),
        price: Number(_data.price1),
        priceAux:  _data.price1Aux,
        pricedolar: Number(_data.price3),
        auxPriceDolar:_data.price3Aux,
        qty: 1,
        discount: 0,
        iva: _data.cod_iva,
        ivaP: _data.iva,
        user_id: this.user.user_id,
        estacion_id: this.user.estacion_id,
        deposito_id: this.user.deposito_id,
        contorno_comandas: [],
      };
      console.log("COMANDA", crearComanda);
      
      this.comandasPorGuardar.push(crearComanda);
      //this.devolverCategorias();
      setTimeout(() => {
        this.btnGuardarComandas.nativeElement.focus();
      }, 50);
      
      console.log('COMANDAS POR GUARDAR', this.comandasPorGuardar);
    } else {
      const modal = await this.modalCtrl.create({
        component: ModalContornosPage,

        swipeToClose: true,
        backdropDismiss: false,
        cssClass: 'modalContornos',
        componentProps: {
          data: _data,
        },
      });
      await modal.present();

      const { data } = await modal.onDidDismiss();
      if (data == undefined) {
        console.log('saliendo vacio');
      } else {
        console.log(data.data);
        let crearComandaContornos = {
          cuenta_id: '',
          product_id: _data.producto_id,
          category_id: _data.categoria_id,
          name: _data.name.replace(/[']+/g, ''),
          pricebase: Number(_data.price1),
          price: Number(_data.price1),
          priceAux:  _data.price1Aux,
          pricedolar: Number(_data.price3),
          auxPriceDolar:_data.price3Aux,
          contorno_comandas: data.data,
          qty: 1,
          discount: 0,
          iva: _data.cod_iva,
          ivaP: _data.iva,
          user_id: this.user.user_id,
          estacion_id: this.user.estacion_id,
          deposito_id: this.user.deposito_id,
        };
        this.comandasPorGuardar.push(crearComandaContornos);
        //this.devolverCategorias();
        setTimeout(() => {
          this.btnGuardarComandas.nativeElement.focus();
        }, 50);
        console.log('ENVIANDO COMANDA', crearComandaContornos);
      }
    }
    this.calcularTotal();
    //console.log(this.comandasPorGuardar);
  }
  /** CODIGO DE LA ALERTA QUE SALE PARA MODIFICAR LA CANTIDAD DE COMANDA**/
  async opcionesComanda(_data) {
    console.log("COMANDA SELECCIONADA =>", _data);
    
    const modal = await this.modalCtrl.create({
      component: ModalOpcionComandasPage,
      cssClass: 'modalOpcionesComanda',
      componentProps:{
        comanda: _data
      }
    })
    modal.present();
    const comanda = await modal.onDidDismiss();
    if(comanda['data'] != undefined){
      console.log("Comanda =>", comanda);
      
      console.log("Comanda saliendo =>", comanda['data']);
      if(comanda['data'].cantidad == "si"){
        _data.qty = comanda['data'].comanda.cantidad;
      }
      if(comanda['data'].contornos == "si"){
          _data.contorno_comandas.length = 0;
          this.respuestaContornosGenerales = comanda.data.comanda['data'];
          console.log("CONTORNOS ASIGNADOS =>", this.respuestaContornosGenerales);
          
          this.respuestaContornosGenerales.forEach((res) => {
            _data.contorno_comandas.push(res);
          });
      }
      if(comanda['data'].borrar == "si"){
        this.borrarComandaLocal(_data)
      }
      this.calcularTotal();
    }
  }

  /** FUNCION PARA BORRAR UNA COMANDA DE MANERA LOCAL**/
  borrarComandaLocal(_data) {
    let lista = [];
    let listaBorrados = [];
    this.comandasPorGuardar.forEach((res) => {
      if (res == _data) {
        listaBorrados.push(res);
      } else {
        if (res != _data) {
          lista.push(res);
        }
      }
    });
    this.comandasPorGuardar = lista;
    console.log(this.comandasPorGuardar);

    this.calcularTotal();
  }
  calcularTotal() {
    console.log("CALCULANDOOO");
    
    this.precioTotalDollar = 0;
    this.precioTotal = 0;
    let precios = [];
    let preciosDolar = [];
    var auxPrecioTotal = 0;
    var auxPrecioTotalDolar = 0;
    var auxIva = 0;
    let auxPorcentajeServicio = 0
    precios.length = 0;
    preciosDolar.length = 0;

    /**RECORRER Y OBTENER LAS COMANDAS QUE NO ESTAN GUARDADAS */
    this.comandasPorGuardar.forEach((element) => {
      /**TRANSFORMAR STRING A NUMBER */
      auxPrecioTotal = Number(element.price) * element.qty;
      //auxPorcentajeServicio = auxPrecioTotal * (this.cuenta['porcentajeServicio']/100);
      auxIva = auxPrecioTotal * (element.ivaP/100);
      precios.push(auxPrecioTotal + auxIva);
    });
    /**RECORRER Y OBTENER LAS COMANDAS QUE TIENE LA CUENTA */
    this.comandas.forEach((element) => {
      /**TRANFORMAR STRING A NUMBER */
      auxPrecioTotal = Number(element.price) * element.qty;
      auxIva = auxPrecioTotal * (element.ivap/100);
      //auxPorcentajeServicio = auxPrecioTotal * (this.cuenta['porcentajeServicio']/100);
      precios.push(auxPrecioTotal + auxIva);

    });
    /**PARA SUMAR TODOS LOS PRECIOS EN BOLIVARES DE LAS COMANDAS*/
    for (var i = 0; i < precios.length; i++) {
      this.precioTotal += precios[i];
    }


    if (this.precioTotal > 0.1) {
      this.precioTotalDollar = this.precioTotal / this.conversiones['tasa'];
    }

    //let dividirDolares = this.cuenta['servicio'] / this.monedas['']
  }
  /**OBTENER CONVERSIONES */
  async pedirConversion(){
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
      this.http.get(this.apiService.pedirConversiones).subscribe(
        (data) => {
          console.log('CONVERSIONEES', data);
          this.conversiones = data;
          this.calcularTotal();
          loading.dismiss();
        },
        (error) => {
          this.toast("Ha ocurrido un error obteniendo la tasa, recargue por favor", "danger");
          console.log(error);
          loading.dismiss();
        }
      );
  }
  /**MODAL PARA VER LAS COMANDAS QUE TIENEN CONTORNOS */
  async verContornosComanda(data) {
    if (data.contornos.length >= 1) {
      this.apiService.sendContornosComanda(data);
      const modal = await this.modalCtrl.create({
        component: ModalContornosComandaPage,

        swipeToClose: true,
        backdropDismiss: false,
        cssClass: 'modalContornos',
      });
      await modal.present();
    } else {
      this.toast('Esta comanda no tiene contornos', 'warning');
    }
  }


  async guardarComandas(){
    let precios = [];
    let precioTotal = 0;
    let ivaComandas = [];
    var auxIva = 0;
    let totalIva = 0;
    var auxPriceComanda  = 0;
    if(this.mode == "mesas"){
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Crear cuenta',
        inputs: [
          {
            name: 'numeroCuenta',
            type: 'text',
            placeholder: 'Numero de cuenta'
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
            handler: async (numero) => {
              const loading = await this.loadingCtrl.create({
                message: 'Cargando...',
                cssClass: 'spinner',
              });
              loading.present();
             let numeroCuenta = numero.numeroCuenta;      
             
             
             console.log("NUMEROOO",numeroCuenta);
             
             let crearUnaCuenta = {
              status: '0',
              mesa_id: this.mesas['mesa_id'],
              cuenta: numeroCuenta,
              estacion_id: this.user.estacion_id,
              usuario: this.user.user_id,
              detalle: ' ',
              client_id: '0001',
              name: this.nameUser,
            };
  
             console.log('CREAR CUENTAAA', crearUnaCuenta);
  
             if (this.user.user_id == undefined) {
               this.toast('No se encuentra logueado', 'danger');
                loading.dismiss();
             } else {
               if (this.mesas['status'] == '3') {
                 this.toast('Esta mesa se encuentra bloqueada', 'danger');
                 this.router.navigate(['/zonas'])
                 loading.dismiss();
               } else {
                 if (numeroCuenta > 999) {
                  loading.dismiss();
                   this.toast('No puede ser un numero mayor a 3 digitos ', 'danger');
                 } else {
                   if (numeroCuenta < 0) {
                    loading.dismiss();
                     this.toast('No puede ser un numero menor a 0', 'danger');
                   } else {
                     if (numeroCuenta == '') {
                       this.toast('El campo esta vacio', 'danger');
                       loading.dismiss();
                     } else {
                       if (crearUnaCuenta.name == undefined) {
                        loading.dismiss();
                         this.toast('Compuebe que este logueado', 'danger');
                       } else {
                         console.log("SI PASO");
                        this.http
                           .post(this.apiService.crearCuentaUrl, crearUnaCuenta)
                           .subscribe(
                             (data) => {
                               
                               let idCuenta = data['cuenta_id'];
         
                               console.log("IDDDDDDDD", idCuenta);
                               
                               this.id = this.activatedRoute.snapshot.paramMap.get('id');
                               //console.log('id', this.id);
                               this.router.navigate(['/comandas', idCuenta]);
  
                               this.apiService.sendComanda(this.comandasPorGuardar);
                               this.toast('Cuenta creada exitosamente', 'success');                           
                               loading.dismiss();
                               this.modalCtrl.dismiss();
                             },
                             (error) => {
                               console.log(error);
                               loading.dismiss();
                               if(error.error['logout'] == true){
                                this.router.navigate(['/login']);
                                this.toast('Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado', 'danger');
                              }else{
                                this.toast('Ha ocurrido un error', 'danger');
                              }
                               if(error.error['detalles'] == 'mesa bloqueada'){
                                 this.toast('La mesa se encuentra bloqueada', 'danger');
                                 this.router.navigate[('/zonas')]
                               }else{
         
                                 this.toast('Ha ocurrido un error', 'danger');
                                 loading.dismiss();
                               }
         
                             }
                           );
                       }
                     }
                   }
                 }
               }
             }
            }
          }
        ]
      });
  
      await alert.present();
    }else{
      if(this.mode == "caja"){
        this.comandasPorGuardar.forEach(res=>{
          auxPriceComanda = res.price * res.qty
          precios.push(auxPriceComanda);

          auxIva = auxPriceComanda * (res.ivaP/100);

          ivaComandas.push(auxIva);
        });
        for (var i = 0; i < precios.length; i++) {
          precioTotal += precios[i];       
        }
        for (var i = 0; i < ivaComandas.length; i++) {
          totalIva += ivaComandas[i];       
        }


        let dataCaja = {
          subtotal: precioTotal,
          iva: totalIva,
          porcentservice: this.user['p_servicio'],
          comandas: this.comandasPorGuardar,
        }
        const modal = await this.modalCtrl.create({
          component: ModalFacturacionPage,
          cssClass: 'modalFacturacion',
          componentProps: {
            cuenta: dataCaja,
            max_descuento: this.user.max_discount,
            mode: "caja"
          }
        })
        modal.present();
        
        const facturacion = await modal.onDidDismiss();
        console.log("SALIENDOOO =>", facturacion['data'].data);
        
        if(facturacion['data'] != undefined){
          console.log("SI PASO POR AQUI");
          
          if(facturacion['data'].data == "SI"){
            this.cerralModal();

          }
        }
      }
    }  


  }

  cerralModal(){
    this.modalCtrl.dismiss();
  }
  async toast(msg, status) {
    const toast = await this.toastr.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 3000,
      cssClass: 'toastCss',
    });
    toast.present();
  }
}
