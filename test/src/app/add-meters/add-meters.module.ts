import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AddMetersPageRoutingModule } from './add-meters-routing.module';

import { AddMetersPage } from './add-meters.page';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMetersPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddMetersPage]
})
export class AddMetersPageModule {}
