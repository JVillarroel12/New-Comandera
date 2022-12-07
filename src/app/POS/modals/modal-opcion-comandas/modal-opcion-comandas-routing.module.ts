import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalOpcionComandasPage } from './modal-opcion-comandas.page';

const routes: Routes = [
  {
    path: '',
    component: ModalOpcionComandasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalOpcionComandasPageRoutingModule {}
