import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleMaps, BaseArrayClass, Marker, GoogleMap, GoogleMapOptions,GoogleMapsEvent } from '@ionic-native/google-maps/ngx'
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx'

import { AngularFireDatabase } from '@angular/fire/database';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

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
    private nativeGeocoder: NativeGeocoder) {}

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
    // this.list = this.afDatabase.database.ref("/meters/").toJSON()
    this.afDatabase.list("/meters/").valueChanges().subscribe((data) => {
      for (let item of data) {
        this.map.addMarker({
          title: item['name'],
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: item['latitude'],
            lng: item['longitude']
          }
        }).then((marker: Marker) => {
          
        });
      }
    }
    );
    
    this.geocode()

    
    // console.log("here2",this.list)
    // console.log("here3",this.list.keys())
    // console.log("here3",this.list[0])
    // let locations = []
    // let coords = []
    // for(let item of this.list) {
    //   locations.push((item["latitude"],item["longitude"]))
    // }




    // this.geocoder.geocode({
    //   "address" : locations
    // }).then((results: BaseArrayClass<GeocoderResult[]>) => {
    //   results.forEach((coord: GeocoderResult[]) => {
    //     this.map.addMarker({
    //       position: coord[0].position
    //     })
    //   });
    // });
    
    // for(let item of this.list) {
    //   // let item = this.list[key]
    //   this.map.addMarker({
    //     title: item['name'],
    //     icon: 'blue',
    //     animation: 'DROP',
    //     position: {
    //       lat: item['latitude'],
    //       lng: item['longitude']
    //     }
    //   }).then((marker: Marker) => {
        
    //   });

    //   console.log("Here:", item['name'], " ", item['latitude'])
    // }
    
  }
  
  geocode() {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.forwardGeocode("39 cloister Ln, hicksville, ny, 11801", options)
      .then((result: NativeGeocoderResult[]) => {
          this.map.moveCamera({
            target: {
              lat: result[0].latitude,
              lng: result[0].longitude
            }
          })
        }
      );
  }
}
