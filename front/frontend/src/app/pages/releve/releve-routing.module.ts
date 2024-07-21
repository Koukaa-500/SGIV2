import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelevePage } from './releve.page';

const routes: Routes = [
  {
    path: '',
    component: RelevePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelevePageRoutingModule {}
