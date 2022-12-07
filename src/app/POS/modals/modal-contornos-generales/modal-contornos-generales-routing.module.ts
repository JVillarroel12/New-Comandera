import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalContornosGeneralesPage } from './modal-contornos-generales.page';

const routes: Routes = [
  {
    path: '',
    component: ModalContornosGeneralesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalContornosGeneralesPageRoutingModule {}
