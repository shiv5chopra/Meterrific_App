import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMetersPage } from './add-meters.page';

const routes: Routes = [
  {
    path: '',
    component: AddMetersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMetersPageRoutingModule {}
