import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AngularFireDatabase } from '@angular/fire/database';

declare var google;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  @ViewChild('directionsPanel', {static: false}) directionsPanel: ElementRef;
  map: any
  userPosition: any
  list: any

  constructor(private platform:Platform,
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private afDatabase : AngularFireDatabase,
    private nativeGeocoder: NativeGeocoder) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  /**
   * Initialize and display the map with markers
   */
  async loadMap() {
    this.geolocation.getCurrentPosition().then((pos) => {
      this.userPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      let mapOptions = {
        center: this.userPosition,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarkers();
      this.navigate();
    }, (err) => {
      console.log(err);
    }); 
  }

  /**
   * Add available parking meters from the real-time database as map markers
   */
  addMarkers() {
    var marker;
    this.afDatabase.list("/meters/").valueChanges().subscribe((data) => {
      for (let item of data) {
        if (item['availability']) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(item['latitude'], item['longitude']),
            map: this.map,
            title: item['name']
          });
          //marker.setMap(this.map);
        }
      }
    });
    //this.geocode()
  }
  
  // geocode() {
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };
  //   this.nativeGeocoder.forwardGeocode("39 cloister Ln, hicksville, ny, 11801", options)
  //     .then((result: NativeGeocoderResult[]) => {
  //         this.map.moveCamera({
  //           target: {
  //             lat: result[0].latitude,
  //             lng: result[0].longitude
  //           }
  //         })
  //       }
  //     );
  // }

  /**
   * Navigate from the user's location to the desired parking meter
   * NEED TO ADD DESTINATION PARAM
   * Should we clear all other markers upon starting navigation?
   */
  navigate() {
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(this.map);
    directionsDisplay.setPanel(this.directionsPanel.nativeElement);
    directionsService.route({
      origin: this.userPosition,
      destination: new google.maps.LatLng(33.774358, -84.396463),
      travelMode: 'DRIVING'
    }, (res, status) => {
      if(status == 'OK'){
          directionsDisplay.setDirections(res);
      } else {
          console.warn(status);
      }
    });
  }
}
