import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalContornosComandaPageRoutingModule } from './modal-contornos-comanda-routing.module';

import { ModalContornosComandaPage } from './modal-contornos-comanda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalContornosComandaPageRoutingModule
  ],
  declarations: [ModalContornosComandaPage]
})
export class ModalContornosComandaPageModule {}
