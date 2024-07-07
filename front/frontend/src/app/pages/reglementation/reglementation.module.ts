import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReglementationPageRoutingModule } from './reglementation-routing.module';

import { ReglementationPage } from './reglementation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReglementationPageRoutingModule
  ],
  declarations: [ReglementationPage]
})
export class ReglementationPageModule {}
