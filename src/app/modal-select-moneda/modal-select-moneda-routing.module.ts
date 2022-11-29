import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalSelectMonedaPage } from './modal-select-moneda.page';

const routes: Routes = [
  {
    path: '',
    component: ModalSelectMonedaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalSelectMonedaPageRoutingModule {}
