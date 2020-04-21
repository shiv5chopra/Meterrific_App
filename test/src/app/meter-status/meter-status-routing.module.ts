import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeterStatusPage } from './meter-status.page';

const routes: Routes = [
  {
    path: '',
    component: MeterStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeterStatusPageRoutingModule {}
