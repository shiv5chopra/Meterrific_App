import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AngularFireDatabase } from '@angular/fire/database';
import { SelectMultipleControlValueAccessor } from '@angular/forms';

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
  destination: any
  destLatLong: any
  location: any
  directionsDisplay: any
  directionsService: any
  interval: any
  metersRef: any
  bestDist: any
  bestMeter: any
  fbList: any
  markers: any

  constructor(private platform:Platform,
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private afDatabase : AngularFireDatabase,
    private nativeGeocoder: NativeGeocoder) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
    // this.metersRef = this.afDatabase.list("/meters/")

    // this.metersRef.valueChanges(['child_changed'])
    //   .subscribe(meters => {
    //     console.log("HIHI")
    //     //this.selectMeter(meters)
    //   });
  }

  /**
   * Initialize and display the map with markers
   */
  async loadMap() {
    this.markers = []
    this.location = "hihi"
    this.bestDist = 9999999
    this.geolocation.getCurrentPosition().then((pos) => {
      this.userPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      let mapOptions = {
        center: this.userPosition,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarkers();
      this.navigateInit();
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
      this.clear()
      for (let item of data) {
        if (item['availability']) {
          let pos = new google.maps.LatLng(item['latitude'], item['longitude'])
          marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            title: item['name']
          });
          this.markers.push(marker)
          if (this.destLatLong) {
            let changed = 0
            let nDist = google.maps.geometry.spherical.computeDistanceBetween(this.destLatLong, pos)
            if (nDist < this.bestDist) {
              this.bestMeter = pos
              this.bestDist = nDist
              changed = 1
            }
            this.navigate(pos)
          }

          //marker.setMap(this.map);
        }
      }
    });
    //this.geocode()
  }

  clear() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = []
  }

  setDestination(dest) {
    this.destination = dest

    // let result = new google.maps.LatLng(33.744570, -84.365910)
    // console.log(result)
    // this.destLatLong = result
    // this.navigate(result)
    this.geocodeAndSet(this.destination)
    
    
  }
  
  geocodeAndSet(dest) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.forwardGeocode(dest, options)
      .then((result: NativeGeocoderResult[]) => {
        this.destLatLong = new google.maps.LatLng(result[0].latitude,result[0].longitude)
        this.navigate(this.destLatLong)
        }
      );
  }

  // geocode(dest) {
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };
  //   this.nativeGeocoder.forwardGeocode(dest, options)
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
  navigateInit() {
    this.directionsService = new google.maps.DirectionsService();
    // if (this.directionsDisplay != null) {
    //     this.directionsDisplay.setMap(null);
    //     this.directionsDisplay = null;
    // }
    this.directionsDisplay = new google.maps.DirectionsRenderer();

    
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);
  }

  navigate(dest) {
    // this.directionsService = new google.maps.DirectionsService();
    // // if (this.directionsDisplay != null) {
    // //     this.directionsDisplay.setMap(null);
    // //     this.directionsDisplay = null;
    // // }
    // this.directionsDisplay = new google.maps.DirectionsRenderer();

    
    // this.directionsDisplay.setMap(this.map);
    // this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);
    this.directionsService.route({
      origin: this.userPosition,
      destination: dest,
      travelMode: 'DRIVING'
    }, (res, status) => {
      if(status == 'OK'){
          this.directionsDisplay.setDirections(res);
      } else {
          console.warn(status);
      }
    });
  }

  selectMeter(list) {
    list.forEach(element => {
      if (element.availability == 1) {
        let meter = new google.maps.LatLng(element.lat, element.long)
        let nDist = google.maps.geometry.spherical.computeDistanceBetween(this.destLatLong, meter)
        if (nDist < this.bestDist) {
          this.bestMeter = meter
          this.bestDist = nDist
        }
      }
    });
  }
  update() {
    
  }
}
