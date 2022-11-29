import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalReservarZonasMesasPageRoutingModule } from './modal-reservar-zonas-mesas-routing.module';

import { ModalReservarZonasMesasPage } from './modal-reservar-zonas-mesas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalReservarZonasMesasPageRoutingModule
  ],
  declarations: [ModalReservarZonasMesasPage]
})
export class ModalReservarZonasMesasPageModule {}
