import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddClientePage } from './modal-add-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddClientePageRoutingModule {}
