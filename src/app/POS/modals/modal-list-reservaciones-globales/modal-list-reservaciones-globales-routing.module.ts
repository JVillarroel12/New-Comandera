import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalListReservacionesGlobalesPage } from './modal-list-reservaciones-globales.page';

const routes: Routes = [
  {
    path: '',
    component: ModalListReservacionesGlobalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalListReservacionesGlobalesPageRoutingModule {}
