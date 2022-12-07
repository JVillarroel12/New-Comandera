import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddReservaPage } from './modal-add-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddReservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddReservaPageRoutingModule {}
