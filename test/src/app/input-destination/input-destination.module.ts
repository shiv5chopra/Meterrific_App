import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InputDestinationPageRoutingModule } from './input-destination-routing.module';

import { InputDestinationPage } from './input-destination.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputDestinationPageRoutingModule
  ],
  declarations: [InputDestinationPage]
})
export class InputDestinationPageModule {}
