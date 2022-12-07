import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCuentasPageRoutingModule } from './modal-cuentas-routing.module';

import { ModalCuentasPage } from './modal-cuentas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCuentasPageRoutingModule
  ],
  declarations: [ModalCuentasPage]
})
export class ModalCuentasPageModule {}
