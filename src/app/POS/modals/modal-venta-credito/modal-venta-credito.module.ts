import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalVentaCreditoPageRoutingModule } from './modal-venta-credito-routing.module';

import { ModalVentaCreditoPage } from './modal-venta-credito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalVentaCreditoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalVentaCreditoPage]
})
export class ModalVentaCreditoPageModule {}
