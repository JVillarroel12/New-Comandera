import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalGenerarReporteReservacionesPage } from './modal-generar-reporte-reservaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ModalGenerarReporteReservacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalGenerarReporteReservacionesPageRoutingModule {}
