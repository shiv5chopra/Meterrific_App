import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeterStatusPageRoutingModule } from './meter-status-routing.module';

import { MeterStatusPage } from './meter-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeterStatusPageRoutingModule
  ],
  declarations: [MeterStatusPage]
})
export class MeterStatusPageModule {}
