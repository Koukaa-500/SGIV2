import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReglementationPage } from './reglementation.page';

const routes: Routes = [
  {
    path: '',
    component: ReglementationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReglementationPageRoutingModule {}
