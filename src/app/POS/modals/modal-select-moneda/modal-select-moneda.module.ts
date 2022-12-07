import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalSelectMonedaPageRoutingModule } from './modal-select-moneda-routing.module';

import { ModalSelectMonedaPage } from './modal-select-moneda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalSelectMonedaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalSelectMonedaPage]
})
export class ModalSelectMonedaPageModule {}
