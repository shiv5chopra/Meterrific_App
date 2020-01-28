import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HihiPageRoutingModule } from './hihi-routing.module';

import { HihiPage } from './hihi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HihiPage
      }
    ])
  ],
  declarations: [HihiPage]
})
export class HihiPageModule {}
