import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDescuentoFacturarPageRoutingModule } from './modal-descuento-facturar-routing.module';

import { ModalDescuentoFacturarPage } from './modal-descuento-facturar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDescuentoFacturarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalDescuentoFacturarPage]
})
export class ModalDescuentoFacturarPageModule {}
