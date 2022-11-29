import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalClaveUsuarioPage } from './modal-clave-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ModalClaveUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalClaveUsuarioPageRoutingModule {}
