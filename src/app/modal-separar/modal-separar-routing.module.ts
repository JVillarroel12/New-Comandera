import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalSepararPage } from './modal-separar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalSepararPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalSepararPageRoutingModule {}
