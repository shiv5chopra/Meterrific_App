import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleMaps, Geocoder, BaseArrayClass, Marker, GeocoderResult, GoogleMap, GoogleMapOptions,GoogleMapsEvent } from '@ionic-native/google-maps/ngx'
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx'

import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  public map: any

  public position: any

  public list: any

  constructor(private platform:Platform,
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private afDatabase : AngularFireDatabase,
    private geocoder: Geocoder) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
    await this.addMarkers();
  }

  async loadMap() {

    
    let pos = await this.geolocation.getCurrentPosition()

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
  }
    
  addMarkers() {
    this.afDatabase.list("/meters/").valueChanges().subscribe((data) =>
      this.list = data
    );
    let locations = []
    let coords = []
    for(let item of this.list) {
      locations.push(item["location"])
    }
    this.geocoder.geocode({
      "address" : locations
    }).then((results: BaseArrayClass<GeocoderResult[]>) => {
      results.forEach((coord: GeocoderResult[]) => {
        this.map.addMarker({
          position: coord[0].position
        })
      });
    });
    

    // this.map.addMarker({
    //   title: '@ionic-native/google-maps',
    //   icon: 'blue',
    //   animation: 'DROP',
    //   position: {
    //     lat: 33.771030,
    //     lng: -84.391090
    //   }
    // }).then((marker: Marker) => {
      
    // });
  }  
}
