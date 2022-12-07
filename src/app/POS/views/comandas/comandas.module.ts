import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComandasPageRoutingModule } from './comandas-routing.module';

import { ComandasPage } from './comandas.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComandasPageRoutingModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule
  ],
  declarations: [ComandasPage]
})
export class ComandasPageModule {}
