import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalGenerarReporteReservacionesPageRoutingModule } from './modal-generar-reporte-reservaciones-routing.module';

import { ModalGenerarReporteReservacionesPage } from './modal-generar-reporte-reservaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalGenerarReporteReservacionesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalGenerarReporteReservacionesPage]
})
export class ModalGenerarReporteReservacionesPageModule {}
