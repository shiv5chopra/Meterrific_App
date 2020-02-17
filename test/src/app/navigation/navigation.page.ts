import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleMaps, GoogleMap, GoogleMapOptions } from '@ionic-native/google-maps/ngx'
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  map: GoogleMap;

  constructor(private platform:Platform,
    private navCtrl: NavController, private geolocation: Geolocation) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((pos) => {

      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          },
          zoom: 10
        }
      }
      this.map = GoogleMaps.create('map_canvas', mapOptions);
    }, (err) => {
      console.log(err); 
      alert('Error finding location');
    });
  }
}
