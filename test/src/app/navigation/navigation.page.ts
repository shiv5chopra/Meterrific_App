import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleMaps, GoogleMap } from '@ionic-native/google-maps/ngx'
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  map: GoogleMap;

  constructor(private platform:Platform,
    private navCtrl: NavController,) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas');
  }

}
