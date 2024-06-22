import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { BuyPage } from './buy/buy.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'intraday',
    loadChildren: () => import('./intraday/intraday.module').then( m => m.IntradayPageModule)
  },
  {
    path: 'buy',
    loadChildren: () => import('./buy/buy.module').then( m => m.BuyPageModule)
  },
  {
    path: 'sell',
    loadChildren: () => import('./sell/sell.module').then( m => m.SellPageModule)
  },
  { path: 'buy/:symbol', component: BuyPage },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
