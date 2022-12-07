import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalListReservacionesPageRoutingModule } from './modal-list-reservaciones-routing.module';

import { ModalListReservacionesPage } from './modal-list-reservaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalListReservacionesPageRoutingModule
  ],
  declarations: [ModalListReservacionesPage]
})
export class ModalListReservacionesPageModule {}
