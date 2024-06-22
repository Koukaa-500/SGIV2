import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntradayPage } from './intraday.page';

const routes: Routes = [
  {
    path: '',
    component: IntradayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntradayPageRoutingModule {}
