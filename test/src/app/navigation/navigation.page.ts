import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AngularFireDatabase } from '@angular/fire/database';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { AlertController } from '@ionic/angular';

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
  directionsDisplay: any
  directionsService: any
  interval: any
  metersRef: any
  bestDist: any
  bestMeter: any
  fbList: any
  markers: any
  markerStatus: any
  distToDestination: any
  done: any
  infoWindowContent: any
  constructor(private platform:Platform,
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private afDatabase : AngularFireDatabase,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController) {}

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
    this.done = 0
    this.markers = {'pos':[]}
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
      this.geolocation.getCurrentPosition().then((pos) => {
        this.userPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      });
      this.bestDist = 99999999
      // this.clear()
      for (let item of data) {
        let pos = new google.maps.LatLng(item['latitude'], item['longitude'])
        if (!this.markers['pos'].includes(pos)) {
          var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
          marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            title: item['name'],
            icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });
          if (!item['availability']) {
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
          }

          var infoWindow = new google.maps.InfoWindow({
            content: ""
          });
          

          this.markers[pos] = {"availability": item['availability'], "marker": marker}
          this.markers['pos'].push(pos)
          let self = this

          marker.addListener('click', function() {
            self.presentAlert(this)
          });
          // google.maps.event.addListener(marker, 'click', (e) => {
          //   var nPos = e.latLng
          //   var temp = this.markers[nPos].marker
          //   console.log([e.latLng.lat(),e.latLng.lng()])


          //   // console.log(this)
          //   if (temp.icon == 'http://maps.google.com/mapfiles/ms/icons/red-dot.png') {
          //       infoWindow.setContent('<div>' + temp.title + '</div>' +
          //         '<button onclick="console.log(this)">Navigate Here</button>');
          //     } else {
          //        infoWindow.setContent('<div>' + temp.title + '</div>');
          //     }
          //     infoWindow.open(temp.map, temp);
          //   // return function() {
          //   //   if (this.icon == 'http://maps.google.com/mapfiles/ms/icons/red-dot.png') {
          //   //     infoWindow.setContent('<div>' + this.title + '</div>' +
          //   //       '<button onclick="setMarkerDestination(this)">Navigate Here</button>');
          //   //   } else {
          //   //     infoWindow.setContent('<div>' + this.title + '</div>');
          //   //   }
              
          //   //   infoWindow.open(this.map, marker);
          //   // }
          // });
          
        }
        else if (item['availability'] && item['availability'] != this.markers[pos].availability) {
          this.markers[pos].availability = item['availability']
          this.markers[pos].marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
        }
        else if (!item['availability'] && item['availability'] != this.markers[pos].availability) {
          this.markers[pos].availability = item['availability']
          this.markers[pos].marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
        }

        // marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
        if (item['availability']) {
          
          if (this.destLatLong) {
            
            let changed = 0
            let nDist = google.maps.geometry.spherical.computeDistanceBetween(this.destLatLong, pos)
            if (nDist < this.bestDist) {
              this.bestMeter = pos
              this.bestDist = nDist
              changed = 1
            }
            // if (changed == 1) {

            // }

            this.distToDestination = google.maps.geometry.spherical.computeDistanceBetween(this.userPosition, this.bestMeter)
            if (this.distToDestination < 20) {
              this.done = 1
              this.destLatLong = null
              this.directionsDisplay.setMap(null)
              this.directionsDisplay.setPanel(null)
            }
          }

          //marker.setMap(this.map);
        }
      }
      if (this.destLatLong) {
        this.navigate(this.bestMeter)
      }
      
    });
    //this.geocode()
  }

  async presentAlert(marker) {
    console.log("here" + marker)
    if(marker.icon == 'http://maps.google.com/mapfiles/ms/icons/red-dot.png') {
      const alert = await this.alertController.create({
        header: 'Marker Selected',
        subHeader: marker.title,
        message: 'This meter is open and available to navigate to!',
        buttons: [
          {
            text: "Navigate",
            handler: data => {
              this.setMarkerDestination(marker)
            }
          }, 
          'Cancel'
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Marker Selected',
        subHeader: marker.title,
        message: 'This meter is occupied. Please try a red marker.',
        buttons: ['Done']
      });
      await alert.present();
    }
    

    
  }

  clear() {
    var keys = Object.keys(this.markers)
    for (var i = 0; i < this.markers.pos.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = []
  }

  setDestination(dest) {
    this.destination = dest
    this.bestDist = 9999999

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

  setMarkerDestination(marker) {
    this.destLatLong = marker.position
    this.navigate(this.destLatLong)
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
    this.directionsDisplay = new google.maps.DirectionsRenderer({preserveViewport: true});

    
    // this.directionsDisplay.setMap(this.map);
    // this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);
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
    console.log(dest)
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);
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
