import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalFacturacionPageRoutingModule } from './modal-facturacion-routing.module';

import { ModalFacturacionPage } from './modal-facturacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalFacturacionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalFacturacionPage]
})
export class ModalFacturacionPageModule {}
