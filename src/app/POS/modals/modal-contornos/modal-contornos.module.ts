import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalContornosPageRoutingModule } from './modal-contornos-routing.module';

import { ModalContornosPage } from './modal-contornos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalContornosPageRoutingModule
  ],
  declarations: [ModalContornosPage]
})
export class ModalContornosPageModule {}
