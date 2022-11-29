import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDescuentoFacturarPage } from './modal-descuento-facturar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDescuentoFacturarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDescuentoFacturarPageRoutingModule {}
