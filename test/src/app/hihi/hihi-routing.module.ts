import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HihiPage } from './hihi.page';

const routes: Routes = [
  {
    path: '',
    component: HihiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HihiPageRoutingModule {}
