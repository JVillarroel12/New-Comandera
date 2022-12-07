import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPreciosPage } from './modal-precios.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPreciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPreciosPageRoutingModule {}
