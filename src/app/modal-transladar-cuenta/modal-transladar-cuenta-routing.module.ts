import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalTransladarCuentaPage } from './modal-transladar-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: ModalTransladarCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalTransladarCuentaPageRoutingModule {}
