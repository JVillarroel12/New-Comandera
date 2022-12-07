import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCuentasPage } from './modal-cuentas.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCuentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCuentasPageRoutingModule {}
