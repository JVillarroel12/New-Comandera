import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertasMeseroPageRoutingModule } from './alertas-mesero-routing.module';

import { AlertasMeseroPage } from './alertas-mesero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertasMeseroPageRoutingModule
  ],
  declarations: [AlertasMeseroPage]
})
export class AlertasMeseroPageModule {}
