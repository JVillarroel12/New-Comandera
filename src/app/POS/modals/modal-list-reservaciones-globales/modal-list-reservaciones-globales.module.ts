import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalListReservacionesGlobalesPageRoutingModule } from './modal-list-reservaciones-globales-routing.module';

import { ModalListReservacionesGlobalesPage } from './modal-list-reservaciones-globales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalListReservacionesGlobalesPageRoutingModule
  ],
  declarations: [ModalListReservacionesGlobalesPage]
})
export class ModalListReservacionesGlobalesPageModule {}
