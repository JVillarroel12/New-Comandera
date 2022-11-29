import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalSepararPageRoutingModule } from './modal-separar-routing.module';

import { ModalSepararPage } from './modal-separar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalSepararPageRoutingModule
  ],
  declarations: [ModalSepararPage]
})
export class ModalSepararPageModule {}
