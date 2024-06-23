import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfondeurPageRoutingModule } from './profondeur-routing.module';

import { ProfondeurPage } from './profondeur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfondeurPageRoutingModule
  ],
  declarations: [ProfondeurPage]
})
export class ProfondeurPageModule {}
