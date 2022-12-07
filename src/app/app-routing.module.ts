import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'alertas-mesero',
    loadChildren: () => import('./POS/modals/alertas-mesero/alertas-mesero.module').then( m => m.AlertasMeseroPageModule)
  },
  {
    path: 'comandas/:id',
    loadChildren: () => import('./POS/views/comandas/comandas.module').then( m => m.ComandasPageModule)
  },
  {
    path: 'cuentas/:id',
    loadChildren: () => import('./POS/views/cuentas/cuentas.module').then( m => m.CuentasPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./POS/views/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'modal-add-reserva',
    loadChildren: () => import('./POS/modals/modal-add-reserva/modal-add-reserva.module').then( m => m.ModalAddReservaPageModule)
  },
  {
    path: 'modal-contornos',
    loadChildren: () => import('./POS/modals/modal-contornos/modal-contornos.module').then( m => m.ModalContornosPageModule)
  },
  {
    path: 'modal-contornos-comanda',
    loadChildren: () => import('./POS/modals/modal-contornos-comanda/modal-contornos-comanda.module').then( m => m.ModalContornosComandaPageModule)
  },
  {
    path: 'modal-contornos-generales',
    loadChildren: () => import('./POS/modals/modal-contornos-generales/modal-contornos-generales.module').then( m => m.ModalContornosGeneralesPageModule)
  },
  {
    path: 'modal-cuentas',
    loadChildren: () => import('./POS/modals/modal-cuentas/modal-cuentas.module').then( m => m.ModalCuentasPageModule)
  },
  {
    path: 'modal-precios',
    loadChildren: () => import('./POS/modals/modal-precios/modal-precios.module').then( m => m.ModalPreciosPageModule)
  },
  {
    path: 'modal-separar',
    loadChildren: () => import('./POS/modals/modal-separar/modal-separar.module').then( m => m.ModalSepararPageModule)
  },
  {
    path: 'modal-transladar-cuenta',
    loadChildren: () => import('./POS/modals/modal-transladar-cuenta/modal-transladar-cuenta.module').then( m => m.ModalTransladarCuentaPageModule)
  },
  {
    path: 'zonas',
    loadChildren: () => import('./POS/views/zonas/zonas.module').then( m => m.ZonasPageModule)
  },
  {
    path: 'modal-add-cliente',
    loadChildren: () => import('./POS/modals/modal-add-cliente/modal-add-cliente.module').then( m => m.ModalAddClientePageModule)
  },
  {
    path: 'modal-list-reservaciones',
    loadChildren: () => import('./POS/modals/modal-list-reservaciones/modal-list-reservaciones.module').then( m => m.ModalListReservacionesPageModule)
  },
  {
    path: 'modal-facturacion',
    loadChildren: () => import('./POS/modals/modal-facturacion/modal-facturacion.module').then( m => m.ModalFacturacionPageModule)
  },
  {
    path: 'modal-select-moneda',
    loadChildren: () => import('./POS/modals/modal-select-moneda/modal-select-moneda.module').then( m => m.ModalSelectMonedaPageModule)
  },
  {
    path: 'modal-configuraciones',
    loadChildren: () => import('./POS/modals/modal-configuraciones/modal-configuraciones.module').then( m => m.ModalConfiguracionesPageModule)
  },
  {
    path: 'modal-generar-reporte-reservaciones',
    loadChildren: () => import('./POS/modals/modal-generar-reporte-reservaciones/modal-generar-reporte-reservaciones.module').then( m => m.ModalGenerarReporteReservacionesPageModule)
  },
  {
    path: 'modal-reservar-zonas-mesas',
    loadChildren: () => import('./POS/modals/modal-reservar-zonas-mesas/modal-reservar-zonas-mesas.module').then( m => m.ModalReservarZonasMesasPageModule)
  },
  {
    path: 'modal-list-reservaciones-globales',
    loadChildren: () => import('./POS/modals/modal-list-reservaciones-globales/modal-list-reservaciones-globales.module').then( m => m.ModalListReservacionesGlobalesPageModule)
  },
  {
    path: 'modal-descuento-facturar',
    loadChildren: () => import('./POS/modals/modal-descuento-facturar/modal-descuento-facturar.module').then( m => m.ModalDescuentoFacturarPageModule)
  },
  {
    path: 'modal-rrpp',
    loadChildren: () => import('./POS/modals/modal-rrpp/modal-rrpp.module').then( m => m.ModalRrppPageModule)
  },
  {
    path: 'modal-clave-usuario',
    loadChildren: () => import('./POS/modals/modal-clave-usuario/modal-clave-usuario.module').then( m => m.ModalClaveUsuarioPageModule)
  },
  {
    path: 'modal-anular-factura',
    loadChildren: () => import('./POS/modals/modal-anular-factura/modal-anular-factura.module').then( m => m.ModalAnularFacturaPageModule)
  },
  {
    path: 'modal-venta-credito',
    loadChildren: () => import('./POS/modals/modal-venta-credito/modal-venta-credito.module').then( m => m.ModalVentaCreditoPageModule)
  },
  {
    path: 'modal-opcion-comandas',
    loadChildren: () => import('./POS/modals/modal-opcion-comandas/modal-opcion-comandas.module').then( m => m.ModalOpcionComandasPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
