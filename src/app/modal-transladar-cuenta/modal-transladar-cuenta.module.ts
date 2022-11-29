import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalTransladarCuentaPageRoutingModule } from './modal-transladar-cuenta-routing.module';

import { ModalTransladarCuentaPage } from './modal-transladar-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalTransladarCuentaPageRoutingModule
  ],
  declarations: [ModalTransladarCuentaPage]
})
export class ModalTransladarCuentaPageModule {}
