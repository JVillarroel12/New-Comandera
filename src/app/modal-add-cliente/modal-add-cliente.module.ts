import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddClientePageRoutingModule } from './modal-add-cliente-routing.module';

import { ModalAddClientePage } from './modal-add-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddClientePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalAddClientePage]
})
export class ModalAddClientePageModule {}
