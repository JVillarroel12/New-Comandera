import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalVentaCreditoPage } from './modal-venta-credito.page';

const routes: Routes = [
  {
    path: '',
    component: ModalVentaCreditoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalVentaCreditoPageRoutingModule {}
