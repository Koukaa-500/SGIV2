import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelevePageRoutingModule } from './releve-routing.module';

import { RelevePage } from './releve.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelevePageRoutingModule
  ],
  declarations: [RelevePage]
})
export class RelevePageModule {}
