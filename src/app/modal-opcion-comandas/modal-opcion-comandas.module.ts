import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalOpcionComandasPageRoutingModule } from './modal-opcion-comandas-routing.module';

import { ModalOpcionComandasPage } from './modal-opcion-comandas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalOpcionComandasPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalOpcionComandasPage]
})
export class ModalOpcionComandasPageModule {}
