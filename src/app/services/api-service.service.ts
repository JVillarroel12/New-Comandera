import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {  map, filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  IP = "http://"+localStorage.getItem('localIp')+"/";

  /** URL PARA HACER LOGIN**/
  loginUrl = this.IP + 'login';                               // ! OAT
  /** URL PARA OBTENER ZONAS**/
  getZonas = this.IP + 'zonas';                               // ! OAT
  /** URL PARA OBTENER LAS CATEGORIAS**/
  getCategorias = this.IP + 'categorias';                     // ! OAT
  /** URL PARA CREAR UNA CUENTA**/
  crearCuentaUrl = this.IP + 'cuentas';
  /** URL PARA CREAR UNA COMANDA**/
  crearComandaUrl = this.IP + 'comandas';                     // ! OAT

  /** URL PARA HACER LOGOUT**/
  logoutUrl = this.IP + 'logout';                             // ! OAT
  /** URL PARA OBTENER UNA CUENTA CON ID**/
  obtenerCuentaId = this.IP + 'cuenta_id/';
  /** URL PARA UNIR LAS CUENTAS SELECCIONADAS**/
  unirCuenta = this.IP + 'unirCuentas';                       // ! OAT
  /** URL PARA OBTENER LA MESA CON ID**/
  getMesa = this.IP + 'mesas/';                               //! OAT
  /** URL PARA SEPARAR LAS CUENTAS **/
  separarCuentas = this.IP + 'separarCuentas'                 // ! OAT

  /** OBTENER COMANDAS CON ID**/
  getComandasUrl = this.IP + 'comandasByCuenta/';             // ! OAT
  /** **/
  getCuentasId = this.IP + 'cuentas/';                        // ! OAT
  /** OBTENER CONTORNOS GENERALES**/
  getContornosGenerales = this.IP + 'contornos';              // ! OAT

  /** OBTENER TRIO CATEGORIAS-CUENTA-COMANDAS**/
  getCuenta = this.IP + 'cuentas/';                           // ! OAT

  /** BLOQUEAR MESA**/
  bloquearMesa = this.IP + 'mesa/status';

  /** BLOQUEAR CUENTA **/
  bloquearCuenta = this.IP + 'cuenta/status';
  /**OBNTENER MONEDAS */
  obtenerMonedas = this.IP + 'monedas';
  /** ACTUALIZAR MESAS POR ZONAS**/
  getMesasByZona = this.IP + 'mesasByZona/';                  // ! OAT
 /** TRALSNADAR CUENTA**/
  transladarCuenta = this.IP + 'trasladarCuentas';            // ! OAT
  /**LLAMADAS ACTIVAS */
  llamadasActivas = this.IP + 'llamadas_activas';
  /**PEDIR PRE-CUENTA */
  pedirPreCuenta = this.IP + 'precuenta/';  
  /**PEDIR MONEDAS */
  pedirConversiones = this.IP + 'getCurrentTasa';             // ! OAT
  /**CREAR RESERVACION */
  crearReserva = this.IP + 'reservacion';                     // ! OAT
  /**PEDIR RESERVA */
  pedirCliente = this.IP + 'clienteByRif/';                   // ! OAT
  /**CREAR CLIENTE */
  crearCliente = this.IP + 'clientes';                        // ! OAT
  /**OBTENER RESERVACIONES */
  obtenerReservaciones = this.IP + 'reservacionesByMesa/';    // ! OAT
  /**CREAR CUENTA POR RESERVACION*/
  crearCuentaReservacion = this.IP + 'cuenta_por_reservacion/';
  /**TIPOS DE RESERVACION */
  tipoReservacion = this.IP + 'tipo_reservacion';             // ! OAT
  getEstaciones = this.IP + 'estaciones/tablet';             // ! OAT
  cancelarReservacion = this.IP + 'reservaciones/cancelar/';  // ! OAT  
  reporteReservacion = this.IP + 'reservaciones/reporte';     // ! OAT
  obtenerReservacionesGlobales = this.IP + 'reservaciones';    // ! OAT
  metodosPagos = this.IP + 'metodo_pagos';                     // ! OAT
  facturarCuenta = this.IP + 'facturar/'                       // ! OAT 
  cuentaCliente = this.IP + 'cuenta/cliente'                    // ! OAT
  agregarComentarioCuenta = this.IP + 'cuenta/detalle'          // ! OAT
  cuentaRRPP = this.IP + 'rrpp/'                                // ! OAT
  validarPermiso = this.IP + 'validarPermiso/'                  // ! OAT
  buscarFactura = this.IP + 'factura/'                  // ! OAT
  anularFactura = this.IP + 'notaCredito'                  // ! OAT
  /** OBSERVABLE PARA EL USER**/
  private UserSource = new BehaviorSubject<{}>({});

   /** OBSERVABLE PARA LA CUENTA**/
  private cuentasSource = new BehaviorSubject <any[]> ([]);

   /** OBSERVABLE PARA LA CUENTA SELECCIONADA**/
  private cuentasSeleccionadasSorce = new BehaviorSubject <any[]> ([]);

   /** OBSERVABLE PARA OBTENER UN ID**/
  private idSource = new BehaviorSubject <any[]> ([]);

  /** OBSERVABLE PARA ENVIAR LOS CONTORNOS AL MODAL **/
  private contornosSource = new BehaviorSubject <any[]> ([]);

  /** OBSERVABLE PARA ENVIAR UNA COMANDA**/
  public comandasSource = new BehaviorSubject <any[]> ([]);
  /** OBSERVABLE PARA LAS CATEGORIAS**/
  private categoriasSource = new BehaviorSubject <any[]> ([]);

  /** OBSERVABLE PARA  VER SI UNA COMANDA TIENE CONTORNOS */
  private contornosComandaSource = new BehaviorSubject <any[]> ([]);
  /** OBSERVABLE PARA TRANSLADAR UNA CUENTA */
  private transladarCuentaSource = new BehaviorSubject <any[]> ([]);
  private mesaReservacion = new BehaviorSubject <any[]> ([]);

  /** OBTENER EL OBSERVABLE DE TRANSLADAR CUENTA */
  $getTransladarCuenta = this.transladarCuentaSource.asObservable();
  /** OBTENER LOS CONTORNOS DEL OBSERVABLE**/
  $getContornos = this.contornosSource.asObservable();
  /** OBTENER LAS CUENTAS DEL OBSERVABLE**/
  $getCuentas = this.cuentasSource.asObservable();

  /** OBTENER EL USER DEL OBSERVABLE**/
  $getUser = this.UserSource.asObservable();
  /** OBTENER LAS CUENTAS SELECCIONADAS DEL OBSERVABLE**/
  $getCuentasSeleccionadasSorce = this.cuentasSeleccionadasSorce.asObservable();

  /** OBTENER LA MESA CON ID DEL OBSERVABLE**/
  $getIdMesa = this.idSource.asObservable();
  /** OBTENER LA COMANDA DEL OBSERVABLE**/
  $getComanda = this.comandasSource.asObservable();

  /** OBTENER LAS CATEGORIAS DEL OBSERVABLE**/
  $getCategorias = this.categoriasSource.asObservable();

  /** VER SI UNA COMANDA TIENE CONTORNOS**/
  $getContornosComanda = this.contornosComandaSource.asObservable();
  $getMesaReservacion = this.mesaReservacion.asObservable();

  actualizarMesas: any;
  mesaBlock: any;

  constructor(
    public http: HttpClient
  ) {
   }
   /** PARA OBTENER LAS ZONAS DEL SERVIDOR**/
   getAllZonas(){
    return this.http
    .get(this.getZonas)
    .pipe(
      map((zonas:any)=>{
        return zonas
      })
    )
    
  }
  /** PARA OBTENER LAS CATEGORIAS DEL SERVIDOR**/
  getAllCategorias(){
    return this.http
    .get(this.getCategorias)
    .pipe(
      map((categorias:any)=>{
        return categorias
      })
    )    
  }

  getContornos(){
    return this.http.get(this.getContornosGenerales)
    .pipe(
      map((contornos:any)=>{
        return contornos
      })
    )
  }
  /** PASAR LA CUENTA A OTRA PANTALLA**/
  sendCuenta(data:any){
    this.cuentasSource.next(data);
  }
  /** PASAR EL USER LOGEADO A OTRA PANTALLA**/
  sendUser(user:any){
    this.UserSource.next(user);
  }
  /** PASAR LA CUENTA  SELECCIONADA A OTRA PANTALLA**/
  sendCuentasSeleccionadas(cuentas:any){
    this.cuentasSeleccionadasSorce.next(cuentas)
  }
  /** PASAR EL ID A OTRA PANTALLA**/
  sendId(id:any){
    this.idSource.next(id)
  }
  sendContornos(contornos:any){
    this.contornosSource.next(contornos);
  }
  sendComanda(comanda:any){
    this.comandasSource.next(comanda);
  }

  sendCategorias(data:any){
    this.categoriasSource.next(data)
  }
  sendContornosComanda(data:any){
    this.contornosComandaSource.next(data);
  }

  sendTransladarCuenta(data:any){
    this.transladarCuentaSource.next(data);
  }
  sendMesaReservacion(data:any){
    this.mesaReservacion.next(data);
  }

  unsubscribeUser(){
    this.UserSource.next(undefined);
  }
}
