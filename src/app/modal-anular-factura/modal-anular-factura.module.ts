import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAnularFacturaPageRoutingModule } from './modal-anular-factura-routing.module';

import { ModalAnularFacturaPage } from './modal-anular-factura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAnularFacturaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalAnularFacturaPage]
})
export class ModalAnularFacturaPageModule {}
