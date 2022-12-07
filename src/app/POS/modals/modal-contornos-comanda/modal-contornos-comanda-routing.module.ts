import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalContornosComandaPage } from './modal-contornos-comanda.page';

const routes: Routes = [
  {
    path: '',
    component: ModalContornosComandaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalContornosComandaPageRoutingModule {}
