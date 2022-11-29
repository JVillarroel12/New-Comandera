import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalReservarZonasMesasPage } from './modal-reservar-zonas-mesas.page';

const routes: Routes = [
  {
    path: '',
    component: ModalReservarZonasMesasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalReservarZonasMesasPageRoutingModule {}
