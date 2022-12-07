import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPreciosPageRoutingModule } from './modal-precios-routing.module';

import { ModalPreciosPage } from './modal-precios.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPreciosPageRoutingModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
  ],
  declarations: [ModalPreciosPage]
})
export class ModalPreciosPageModule {}
