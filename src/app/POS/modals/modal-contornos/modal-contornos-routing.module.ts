import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalContornosPage } from './modal-contornos.page';

const routes: Routes = [
  {
    path: '',
    component: ModalContornosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalContornosPageRoutingModule {}
