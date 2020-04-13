import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayMeterPageRoutingModule } from './pay-meter-routing.module';

import { PayMeterPage } from './pay-meter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayMeterPageRoutingModule
  ],
  declarations: [PayMeterPage]
})
export class PayMeterPageModule {}
