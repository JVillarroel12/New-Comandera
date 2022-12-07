import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRrppPageRoutingModule } from './modal-rrpp-routing.module';

import { ModalRrppPage } from './modal-rrpp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRrppPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalRrppPage]
})
export class ModalRrppPageModule {}
