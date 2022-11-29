import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZonasPageRoutingModule } from './zonas-routing.module';

import { ZonasPage } from './zonas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZonasPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ZonasPage]
})
export class ZonasPageModule {}
