import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAnularFacturaPage } from './modal-anular-factura.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAnularFacturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAnularFacturaPageRoutingModule {}
