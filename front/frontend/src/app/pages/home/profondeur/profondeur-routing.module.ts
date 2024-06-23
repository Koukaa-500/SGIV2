import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfondeurPage } from './profondeur.page';

const routes: Routes = [
  {
    path: '',
    component: ProfondeurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfondeurPageRoutingModule {}
