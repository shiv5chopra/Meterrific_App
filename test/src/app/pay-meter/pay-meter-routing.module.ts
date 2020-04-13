import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayMeterPage } from './pay-meter.page';

const routes: Routes = [
  {
    path: '',
    component: PayMeterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayMeterPageRoutingModule {}
