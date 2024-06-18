import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdorPageRoutingModule } from './ordor-routing.module';

import { OrdorPage } from './ordor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdorPageRoutingModule
  ],
  declarations: [OrdorPage]
})
export class OrdorPageModule {}
