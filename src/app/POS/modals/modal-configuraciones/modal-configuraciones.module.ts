import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalConfiguracionesPageRoutingModule } from './modal-configuraciones-routing.module';

import { ModalConfiguracionesPage } from './modal-configuraciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalConfiguracionesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalConfiguracionesPage]
})
export class ModalConfiguracionesPageModule {}
