import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalRrppPage } from './modal-rrpp.page';

const routes: Routes = [
  {
    path: '',
    component: ModalRrppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRrppPageRoutingModule {}
