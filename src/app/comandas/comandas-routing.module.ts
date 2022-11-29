import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComandasPage } from './comandas.page';

const routes: Routes = [
  {
    path: '',
    component: ComandasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComandasPageRoutingModule {
}
