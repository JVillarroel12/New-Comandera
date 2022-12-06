import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'alertas-mesero',
    loadChildren: () => import('./alertas-mesero/alertas-mesero.module').then( m => m.AlertasMeseroPageModule)
  },
  {
    path: 'comandas/:id',
    loadChildren: () => import('./comandas/comandas.module').then( m => m.ComandasPageModule)
  },
  {
    path: 'cuentas/:id',
    loadChildren: () => import('./cuentas/cuentas.module').then( m => m.CuentasPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'modal-add-reserva',
    loadChildren: () => import('./modal-add-reserva/modal-add-reserva.module').then( m => m.ModalAddReservaPageModule)
  },
  {
    path: 'modal-contornos',
    loadChildren: () => import('./modal-contornos/modal-contornos.module').then( m => m.ModalContornosPageModule)
  },
  {
    path: 'modal-contornos-comanda',
    loadChildren: () => import('./modal-contornos-comanda/modal-contornos-comanda.module').then( m => m.ModalContornosComandaPageModule)
  },
  {
    path: 'modal-contornos-generales',
    loadChildren: () => import('./modal-contornos-generales/modal-contornos-generales.module').then( m => m.ModalContornosGeneralesPageModule)
  },
  {
    path: 'modal-cuentas',
    loadChildren: () => import('./modal-cuentas/modal-cuentas.module').then( m => m.ModalCuentasPageModule)
  },
  {
    path: 'modal-precios',
    loadChildren: () => import('./modal-precios/modal-precios.module').then( m => m.ModalPreciosPageModule)
  },
  {
    path: 'modal-separar',
    loadChildren: () => import('./modal-separar/modal-separar.module').then( m => m.ModalSepararPageModule)
  },
  {
    path: 'modal-transladar-cuenta',
    loadChildren: () => import('./modal-transladar-cuenta/modal-transladar-cuenta.module').then( m => m.ModalTransladarCuentaPageModule)
  },
  {
    path: 'zonas',
    loadChildren: () => import('./zonas/zonas.module').then( m => m.ZonasPageModule)
  },
  {
    path: 'modal-add-cliente',
    loadChildren: () => import('./modal-add-cliente/modal-add-cliente.module').then( m => m.ModalAddClientePageModule)
  },
  {
    path: 'modal-list-reservaciones',
    loadChildren: () => import('./modal-list-reservaciones/modal-list-reservaciones.module').then( m => m.ModalListReservacionesPageModule)
  },
  {
    path: 'modal-facturacion',
    loadChildren: () => import('./modal-facturacion/modal-facturacion.module').then( m => m.ModalFacturacionPageModule)
  },
  {
    path: 'modal-select-moneda',
    loadChildren: () => import('./modal-select-moneda/modal-select-moneda.module').then( m => m.ModalSelectMonedaPageModule)
  },
  {
    path: 'modal-configuraciones',
    loadChildren: () => import('./modal-configuraciones/modal-configuraciones.module').then( m => m.ModalConfiguracionesPageModule)
  },
  {
    path: 'modal-generar-reporte-reservaciones',
    loadChildren: () => import('./modal-generar-reporte-reservaciones/modal-generar-reporte-reservaciones.module').then( m => m.ModalGenerarReporteReservacionesPageModule)
  },
  {
    path: 'modal-reservar-zonas-mesas',
    loadChildren: () => import('./modal-reservar-zonas-mesas/modal-reservar-zonas-mesas.module').then( m => m.ModalReservarZonasMesasPageModule)
  },
  {
    path: 'modal-list-reservaciones-globales',
    loadChildren: () => import('./modal-list-reservaciones-globales/modal-list-reservaciones-globales.module').then( m => m.ModalListReservacionesGlobalesPageModule)
  },
  {
    path: 'modal-descuento-facturar',
    loadChildren: () => import('./modal-descuento-facturar/modal-descuento-facturar.module').then( m => m.ModalDescuentoFacturarPageModule)
  },
  {
    path: 'modal-rrpp',
    loadChildren: () => import('./modal-rrpp/modal-rrpp.module').then( m => m.ModalRrppPageModule)
  },
  {
    path: 'modal-clave-usuario',
    loadChildren: () => import('./modal-clave-usuario/modal-clave-usuario.module').then( m => m.ModalClaveUsuarioPageModule)
  },
  {
    path: 'modal-anular-factura',
    loadChildren: () => import('./modal-anular-factura/modal-anular-factura.module').then( m => m.ModalAnularFacturaPageModule)
  },
  {
    path: 'modal-venta-credito',
    loadChildren: () => import('./modal-venta-credito/modal-venta-credito.module').then( m => m.ModalVentaCreditoPageModule)
  },
  {
    path: 'modal-opcion-comandas',
    loadChildren: () => import('./modal-opcion-comandas/modal-opcion-comandas.module').then( m => m.ModalOpcionComandasPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
