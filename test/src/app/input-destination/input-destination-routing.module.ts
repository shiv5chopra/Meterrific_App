import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InputDestinationPage } from './input-destination.page';

const routes: Routes = [
  {
    path: '',
    component: InputDestinationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputDestinationPageRoutingModule {}
