import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NavigationPageRoutingModule } from './navigation-routing.module';

import { NavigationPage } from './navigation.page';
import { NativeGeocoder} from '@ionic-native/native-geocoder/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavigationPageRoutingModule,
  ],
  providers: [
    NativeGeocoder,
  ],
  declarations: [NavigationPage]
})
export class NavigationPageModule {}
