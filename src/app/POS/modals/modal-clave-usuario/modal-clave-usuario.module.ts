import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalClaveUsuarioPageRoutingModule } from './modal-clave-usuario-routing.module';

import { ModalClaveUsuarioPage } from './modal-clave-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalClaveUsuarioPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalClaveUsuarioPage]
})
export class ModalClaveUsuarioPageModule {}
