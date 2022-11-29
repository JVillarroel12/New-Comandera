import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalContornosGeneralesPageRoutingModule } from './modal-contornos-generales-routing.module';

import { ModalContornosGeneralesPage } from './modal-contornos-generales.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalContornosGeneralesPageRoutingModule,
    Ng2SearchPipeModule,
  ],
  declarations: [ModalContornosGeneralesPage]
})
export class ModalContornosGeneralesPageModule {}
