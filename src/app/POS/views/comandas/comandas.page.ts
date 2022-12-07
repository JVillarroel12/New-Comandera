import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonButton, IonInput, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ApiServiceService } from '../../../services/api-service.service';
import { Location } from '@angular/common';
import { ModalContornosPage } from '../../modals/modal-contornos/modal-contornos.page';
import { ModalContornosGeneralesPage } from '../../modals/modal-contornos-generales/modal-contornos-generales.page';
import { ModalContornosComandaPage } from '../../modals/modal-contornos-comanda/modal-contornos-comanda.page';
import { AlertasMeseroPage } from '../../modals/alertas-mesero/alertas-mesero.page';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalAddClientePage } from '../../modals/modal-add-cliente/modal-add-cliente.page';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalOpcionComandasPage } from '../../modals/modal-opcion-comandas/modal-opcion-comandas.page';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-comandas',
  templateUrl: './comandas.page.html',
  styleUrls: ['./comandas.page.scss'],
})
export class ComandasPage implements OnInit {
  //@ViewChild('guardarComandas', { static: false }) btnGuardarComandas: IonButton;
  @ViewChild('btnGuardarComandas') btnGuardarComandas: ElementRef;
  user_image: SafeResourceUrl;
  imagenes = [];
  formComentario: FormGroup;
  formCliente: FormGroup
  search = '';

  comandas: any;
  comandasPorGuardar = [];
  categorias: any[] = [];
  categoriasHijo = [];
  conversiones: any;

  categoriasVolver = [];
  respuestaContornosGenerales: any;

  productos = [];

  menuCategoria = [];

  cuenta: any;
  devolver: boolean = false;
  OcultarProductos: boolean = false;
  textoBuscar = '';

  nameMesa: any;
  nameUser: any;
  nombreCliente = '';
  detalle_cuenta = '';
  rifCliente = '';
  id_cliente: '';
  user: any;
  cantidadComanda: any;
  id: any;
  obtenerCategorias = localStorage.getItem('categorias');
  incluyeImpuesto:any;
  precioTotal = 0;
  precioTotalDollar = 0;

  statusCuenta: string;

  alertasLlamadas = [];

  myText = '';
  recording = false;
  tema = localStorage.getItem('cambiarTema');
  mesaID = localStorage.getItem('mesaID');
  tasa: 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    public apiService: ApiServiceService,
    public http: HttpClient,
    public router: Router,
    public alertCtrl: AlertController,
    public toastr: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public actionSheet: ActionSheetController,
    public platform: Platform,
    public location: Location,
    private changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) //private socket: Socket
  {
    //SpeechRecognition.requestPermission();
    this.tema = localStorage.getItem('cambiarTema');
  }
  async ngOnInit() {
    console.log("IMAGENES =.>", this.imagenes);
    this.formComentario = this.formBuilder.group({
      comentario: ['']
    });
    this.formCliente = this.formBuilder.group({
      rif: ['']
    })
  }
  ionViewWillEnter(){
        this.platform.backButton.subscribeWithPriority(10, () => {
          if (this.location.isCurrentPathEqualTo('/comandas')) {
            this.router.navigate([
              '/cuentas',
              this.mesaID,
            ]);
          }
          this.router.navigate(['/cuentas', this.mesaID]);
        });
        /** CODIGO PARA OBTENER EL USER LOGEADO**/
        this.apiService.$getUser.subscribe((data) => {
          console.log("USEEERR",data);
          this.user = data;
          this.nameUser = this.user.user_name;

        });
        if (this.user.user_id != undefined) {
          /** CODIGO PARA OBTENER EL ID DE LA MESA **/
          this.id = this.activatedRoute.snapshot.paramMap.get('id');
          //console.log("id", this.id);
          this.obtenerCuenta(this.id);
          /**OBTENER COMANDAS DESDE VER PRECIOS */
          this.apiService.$getComanda.subscribe((data) => {
            console.log("LLEGANDO POR VISOR DE PRECIOOOOOS",data);
            console.log("ID CUENTA", this.id);
      
            data.forEach((res) => {
              res.cuenta_id = this.id;
      
              this.comandasPorGuardar.push(res);
            });
      
            //console.log("COMANDAAAS", this.comandasPorGuardar);
          });
        this.funcionObtenerCategorias();
        //console.log("MESAAAAAAAAAAA", this.apiService.mesaBlock);
        this.nameMesa = this.apiService.mesaBlock['name'];
          
        } else {
          if (this.user.user_id == undefined) {
            console.log('NO estas conectado');
            this.router.navigate(['/login'])
            //this.socket.disconnect();
          }
        }

  }
  ngOnDestroy() {
    this.apiService.sendComanda([]);
  }
  paginaAtras(){
    this.router.navigate([`cuentas/${this.mesaID}`])
  }
  /** FUNCION PARA OBTENER LAS CATEGORIAS**/
  funcionObtenerCategorias() {
    var transformarCategorias = JSON.parse(this.obtenerCategorias);
    this.categorias = transformarCategorias.categorias;
    this.imagenes = transformarCategorias.imagenes;
    console.log("IMAGENEES =>", this.imagenes);
    
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
  /**  CODIGO PARA OBTENER LA CUENTA POR ID**/
  async obtenerCuenta(id) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    this.http.get(this.apiService.getCuenta + id).subscribe(
      (data) => {
        console.log("DATAAAAAAAAAAAAAAAAAAAAAAA",data);
        
        this.cuenta = data;
        console.log('CUENTAAA', this.cuenta);
        this.nombreCliente = this.cuenta['name'];
        this.id_cliente = this.cuenta['client_id'];
        this.statusCuenta = this.cuenta.status;
        this.detalle_cuenta = this.cuenta['detalle'];
        this.comandas = data['comandas'];

        this.comandas.forEach(res => {
          let priceBolivares = Number(res.price);
          let priceDolar = Number(res.pricedolar);
          let ivaDolares = 0;
          let ivaBolivares = 0
          if(this.incluyeImpuesto == "1"){
            ivaDolares = Number(res.pricedolar) *(res.ivap/100);
            ivaBolivares = Number(res.price)*(res.ivap/100);
          }
          res.auxPrice = priceBolivares + ivaBolivares;
          res.auxPriceDolar = priceDolar + ivaDolares;
          
        });
        /**OBTENER CONVERSIONES */

        this.http.get(this.apiService.pedirConversiones).subscribe(
          (data) => {
            console.log('CONVERSIONEES', data);
            this.tasa = data['tasa'];
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

      },
      (error) => {
        console.log('Error=>', error);
        if (error.error['logout'] == true) {
          this.router.navigate(['/login']);
          this.toast(
            'Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado',
            'danger'
          );
        } else {
          this.toast('Ha ocurrido un error pidiendo la cuenta', 'danger');
        }
        loading.dismiss();
      }
    );
  }
  /** CODIGO PARA OBTENER LA CATEGORIA SELECCIONADA**/
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
    console.log("MENU CATEGORIA",_data);

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
    this.textoBuscar = '';
    this.buscar(this.textoBuscar);
    this.funcionObtenerCategorias();
    this.devolver = false;
    this.productos.length = 0;
    this.menuCategoria.length = 0;
  }
  /** CODIGO PARA CREAR UNA COMANDA **/
  async crearComanda(_data) {
    console.log("PRODUCTO =>", _data);
    _data.comprobarPrecio = false;
    if(_data.price1 == 0){
      const alert = await this.alertCtrl.create({
        header: 'Atencion',
        subHeader: 'El producto tiene el precio en 0, lo cual puede ocasionar problemas al momento de imprimirlo',
        message: '¿Desea continuar de todos modos?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              _data.comprobarPrecio = false;
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler:async() => {
              console.log("HOLAAA");
              
              _data.comprobarPrecio = true;
              if(_data.comprobarPrecio == true){
                if (_data.contornos.length == 0) {
                  let ivaBolivares = Number(_data.PRICE1)*(_data.IVAP/100);
            
                  let crearComanda = {
                    cuenta_id: this.id,
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
                
                  this.comandasPorGuardar.push(crearComanda);
                  //this.devolverCategorias();
                  //this.btnGuardarComandas.nativeElement.autofocus;
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
                      cuenta_id: this.id,
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
                    console.log('ENVIANDO COMANDA', crearComandaContornos);
                    setTimeout(() => {
                      this.btnGuardarComandas.nativeElement.focus();
                    }, 50);
                    //this.btnGuardarComandas.nativeElement.autofocus;
                  }
                }
              }
            },
          },
        ],
      });
  
      await alert.present();
    }else{
      _data.comprobarPrecio = true;
      
    }
    console.log("COMANDA 2222 =>", _data);
    
    if(_data.comprobarPrecio == true){
      if (_data.contornos.length == 0) {
        let ivaBolivares = Number(_data.PRICE1)*(_data.IVAP/100);
  
        let crearComanda = {
          cuenta_id: this.id,
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
      
        this.comandasPorGuardar.push(crearComanda);
        //this.devolverCategorias();
        //this.btnGuardarComandas.nativeElement.autofocus;
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
            cuenta_id: this.id,
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
          console.log('ENVIANDO COMANDA', crearComandaContornos);
          setTimeout(() => {
            this.btnGuardarComandas.nativeElement.focus();
          }, 50);
          //this.btnGuardarComandas.nativeElement.autofocus;
        }
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
  /**  CODIGO PARA GUARDAR LAS COMANDAS EN EL SERVIDOR**/

  async guardarComandas() {
    console.log('COMANDAS QUE VEN A GUARDARSE', this.comandasPorGuardar);
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    /**SI NO ESTA LOGEADO */
    if (this.user.user_id == undefined) {
      this.toast('No se encuentra logueado', 'danger');
      loading.dismiss();
    } else {
      if (this.apiService.mesaBlock['status'] == '3') {
        this.toast('Esta mesa esta Bloquedada', 'danger');
        loading.dismiss();
      } else {
        /** SI LA CUENTA ESTA BLOQUEADA */
        if (this.cuenta.status == '2') {
          this.toast('Esta cuenta esta Bloquedada', 'danger');
          loading.dismiss();
        } else {
          /**SI NO HAY COMANDAS PARA GUARDAR */
          if (this.comandasPorGuardar.length == 0) {
            loading.dismiss();
            this.toast('No hay comandas nuevas por guardar', 'danger');
          } else {
            /** SI ESTA TODO OK */

            console.log();
            let data = {
              comandas: this.comandasPorGuardar,
              detalle: this.formComentario.value.comentario,
              client_id: this.id_cliente
            }
            console.log("DATA A GUARDAR =>", data);
            
            return this.http
              .post(this.apiService.crearComandaUrl, data)
              .subscribe(
                (data) => {
                  console.log('AQUIIII', data);
                  loading.dismiss();
                  this.id = this.activatedRoute.snapshot.paramMap.get('id');
                  console.log('id', this.id);
                  this.obtenerCuenta(this.id);
                  this.comandasPorGuardar.length = 0;
                    this.toast("Se han guardado las comandas con exito", 'success');
                },
                (error) => {
                  console.log('error=>', error);

                  loading.dismiss();
                  if (error.error['logout'] == true) {
                    this.router.navigate(['/login']);
                    this.toast(
                      'Su sesion no se encuenta activa, numero maximo de dispositivos alcanzado',
                      'danger'
                    );
                  } else {
                    this.toast('Ha ocurrido un error', 'danger');
                  }
                }
              );
          }
        }
      }
    }
  }
  /**LLAMAR DE NUEVO AL SERVICIO PARA OBTENER LAS CATEGORIAS */
  async actualizarCategorias() {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
    
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    this.apiService.getAllCategorias().subscribe(
      (data) => {
        console.log("DATA CATEGORIAS =>", data);
        
        localStorage.setItem('incluyeImpuesto', data.incluye_impuesto)
        localStorage.setItem('categorias', JSON.stringify(data));

        this.obtenerCategorias = localStorage.getItem('categorias');
        if(this.productos != null){
          this.productos.length = 0;

        }
        this.funcionObtenerCategorias();
        loading.dismiss();
        this.toast('Las categorias han sido actualizadas', 'success');
      },
      (error) => {
        loading.dismiss();
      }
    );
  }
  /** CALCULAR EL TOTAL DE LA CUENTA EN DOLARES Y BOLIVARES */
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
      auxPorcentajeServicio = auxPrecioTotal * (this.cuenta['porcentservice']/100);
      auxIva = auxPrecioTotal * (element.ivaP/100);
      precios.push(auxPrecioTotal + auxPorcentajeServicio + auxIva);

    });
    /**RECORRER Y OBTENER LAS COMANDAS QUE TIENE LA CUENTA */
    this.comandas.forEach((element) => {
      /**TRANFORMAR STRING A NUMBER */
      auxPrecioTotal = Number(element.price) * element.qty;
      auxIva = auxPrecioTotal * (element.ivap/100);
      auxPorcentajeServicio = auxPrecioTotal * (this.cuenta['porcentservice']/100);

      
      precios.push(auxPrecioTotal + auxPorcentajeServicio + auxIva);

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

  /**MODAL PARA VER LAS COMANDAS QUE TIENEN CONTORNOS */
  async verContornosComanda(data) {
    if (data.contorno_comandas.length >= 1) {
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
  async imprimirPreCuenta() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });

    const alert = await this.alertCtrl.create({
      cssClass: 'preCuenta',
      message: 'Estas seguro de que quieres imprimir una pre-cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Si',
          handler: () => {
            loading.present();
            console.log('Confirm Okay');

            console.log('ID DE LA CUENTA PARA ENVIAR', this.id);
            if(this.comandas.length > 0){
              this.http.get(this.apiService.pedirPreCuenta + this.id).subscribe(
                (data) => {
                  console.log(data);
                  loading.dismiss();
                  this.toast("Proceso de impresion completado", "success");
                },
                (error) => {
                  console.log(error);
                  this.toast(error.error.message, "danger");
                  loading.dismiss();
                }
              );
            }else{
              this.toast("Esta cuenta no posee comandas", "danger");
              loading.dismiss();
            }

          },
        },
      ],
    });

    await alert.present();
  }
  async bloquearCuenta() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();

    /**BLOQUEAD CUENTA */
    if (this.statusCuenta == '0') {
      let dataCuenta = {
        cuenta_id: this.id,
        status: '2',
      };
      this.http.put(this.apiService.bloquearCuenta, dataCuenta).subscribe(
        (data) => {
          console.log(data);
          this.toast('Cuenta bloqueada exitosamente', 'success');
          this.obtenerCuenta(this.id);
          loading.dismiss();
        },
        (error) => {
          loading.dismiss();
          console.log('error=>', error);
          this.toast('Ha ocurrido un error', 'danger');
        }
      );
    } else {
      /**DESBLOQUEAR CUENTA */
      if (this.statusCuenta == '2') {
        let dataCuenta = {
          cuenta_id: this.id,
          status: '0',
        };
        this.http.put(this.apiService.bloquearCuenta, dataCuenta).subscribe(
          (data) => {
            console.log(data);
            this.toast('Cuenta desbloqueada exitosamente', 'success');
            this.obtenerCuenta(this.id);
            loading.dismiss();
          },
          (error) => {
            console.log('error=>', error);
            this.toast('Ha ocurrido un error', 'danger');
          }
        );
      }
    }
  }
  /** FILTRO PARA EL BUSCADOR DE COMANDAS**/
  buscar(_event) {
    this.textoBuscar = _event;

    setTimeout(() => {
      this.textoBuscar = _event;
    }, 100);
  }
  searchKeyCliente(_event){
    if(_event.charCode == "13"){
      this.searchCliente()
    }
  }
  async searchCliente(){
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    this.http.get(this.apiService.pedirCliente + this.formCliente.value.rif).subscribe(res=>{
      console.log("CLIENTE =>", res);
      this.nombreCliente = res['name'];
      this.id_cliente = res['client_id']
      let cuenta = {
        cuenta_id: this.cuenta['cuenta_id'],
        client_id: res['client_id']
      }
      this.http.put(this.apiService.cuentaCliente, cuenta).subscribe(res =>{
        console.log(res);
        this.toast("Se ha actualizado la cuenta", "success")
      },(error)=>{
        console.log(error.error);
        
        this.toast("Ha ocurrido un error asignando el cliente", "danger");  
      })
      loading.dismiss();
    },(error)=>{
      if(error.error.code == 404){
        this.toast("No se ha encontrado el cliente", "warning");
        this.addCliente();
      }else{
        this.toast("Ha ocurrido un error obteniendo el cliente", "danger");
      }
      console.log(error.error);
      loading.dismiss();
    })
  }
  async addCliente(){
    const modal = await this.modalCtrl.create({
      component: ModalAddClientePage,
      cssClass: "modalAddCliente"
    })
    await modal.present();

    const cliente = await modal.onDidDismiss();
    if(cliente.data != undefined){

      let cuenta = {
        cuenta_id: this.cuenta['cuenta_id'],
        client_id: cliente['data'].data['client_id']
      }
      this.http.put(this.apiService.cuentaCliente, cuenta).subscribe(res =>{
        console.log(res);
        this.toast("Se ha actualizado la cuenta", "success");
        this.nombreCliente = cliente['data'].data.name;
        this.rifCliente = cliente['data'].data.rif;
      },(error)=>{
        console.log(error.error);
        
        this.toast("Ha ocurrido un error asignando el cliente", "danger");  
      })
    }

  }
  keyComentario(_event){
    if(_event == '13'){
      this.addComentario();
    }
  }
  addComentario(){
    let detalle = {
      detalle: this.formComentario.value.comentario,
      cuenta_id: this.cuenta['cuenta_id']
    }
    this.http.put(this.apiService.agregarComentarioCuenta, detalle).subscribe(res=>{
      console.log("RES COMENTARIO =>", res);
      this.toast("Se ha agregado el comentario con exito", "success");
      
      
    },(error)=>{
      console.log("ERROR =>", error.error);
      
      this.toast("Ha ocurrido un error agregando un comentario", "danger");
    })

    
  }
  /** MENSAJES DE RESPUESTA EN EL TOP**/
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
  /** ABRIR EL MODAL PARA LAS ALERTAS DEL MESERO**/
  async abrirAlertas() {
    const modal = await this.modalCtrl.create({
      component: AlertasMeseroPage,

      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
      cssClass: 'modalSeparar',
    });
    await modal.present();
  }
  /**ALERTAS DEL MESERO */
  // alertasMesero(){
  //   /** OBTENER LAS LLAMADAS ACTIVAS */
  //   this.http.get(this.apiService.llamadasActivas).subscribe(data=>{
  //     this.alertasLlamadas = data['llamadas'];
  //     console.log("LLEGANDO POR SERVICIO",this.alertasLlamadas);

  //   });
  //   /**CONECTARSE AL SOCKET */
  //   this.socket.connect();
  //   // PARA ACCEDER A LAS LLAMADAS
  //   this.socket.on('llamadaDeMesa', (data) => {

  //     console.log('recibido por socket', data);

  //     console.log("llegando alertas", this.alertasLlamadas);
  //     this.http.get(this.apiService.llamadasActivas).subscribe(data=>{
  //       this.alertasLlamadas = data['llamadas'];
  //       console.log("LLEGANDO POR SERVICIO",this.alertasLlamadas);

  //     });
  //     this.toast("Ha recibido una llamada en una mesa","success");
  //   });
  //   /**ACCEDER A LLAMADAS TERMINADAS */
  //   this.socket.on('terminarLlamada', (data) => {
  //     this.toast("Se ha cancelado una llamada","warning");
  //     console.log('cancelado por socket', data);
  //     this.http.get(this.apiService.llamadasActivas).subscribe(data=>{
  //       this.alertasLlamadas = data['llamadas'];
  //       console.log("LLEGANDO POR SERVICIO",this.alertasLlamadas);

  //     });

  //   });

  // }
  async toastWarning(msg, status) {
    const toast = await this.toastr.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 4000,
      cssClass: 'toastCss',
      buttons: [
        {
          side: 'start',
          icon: 'warning',
        },
      ],
    });
    toast.present();
  }
  /** CERRAR SESION**/
  async cerrarSesion() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'spinner',
    });
    loading.present();
    let cerrarSesion = {
      user_id: this.user.user_id,
    };
    this.http.post(this.apiService.logoutUrl, cerrarSesion).subscribe(
      (data) => {
        //this.socket.disconnect();
        console.log(data);
        this.router.navigate(['/login']);
        loading.dismiss();
        this.apiService.unsubscribeUser();

      },
      (error) => {
        loading.dismiss();
        this.router.navigate(['/login']);
        this.apiService.unsubscribeUser();

      }
    );
  }
}
