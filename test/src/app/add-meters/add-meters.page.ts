import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController, } from '@ionic/angular';

@Component({
  selector: 'app-add-meters',
  templateUrl: './add-meters.page.html',
  styleUrls: ['./add-meters.page.scss'],
})
export class AddMetersPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
 
  validation_messages = {
    'address': [
      { type: 'required', message: 'Address is required.' },
    ],
    'latitude': [
      { type: 'required', message: 'Latitude is required.' },
    ],
    'longitude': [
      { type: 'required', message: 'Longitude is required.' },
    ],
    'startDay': [
      { type: 'required', message: 'Start Day Time is required.' },
    ],
    'endDay': [
      { type: 'required', message: 'End Day Time is required.' },
    ],
    'cost': [
      { type: 'required', message: 'Cost for 15 Mins is required.' },
    ],
    'maxMins': [
      { type: 'required', message: 'Max Minutes is required.' },
    ],
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private afDatabase : AngularFireDatabase,
    private alertController : AlertController) { }

  ngOnInit(){
    this.validations_form = this.formBuilder.group({
      address: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      latitude: new FormControl('', Validators.compose([
        Validators.required
      ])),
      longitude: new FormControl('', Validators.compose([
        Validators.required
      ])),
      startDay: new FormControl('', Validators.compose([
        Validators.required
      ])),
      endDay: new FormControl('', Validators.compose([
        Validators.required
      ])),
      cost: new FormControl('', Validators.compose([
        Validators.required
      ])),
      maxMins: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  sendMeter() {

    this.afDatabase.database.ref("/meters/").push({
      "address" : this.validations_form.get("address").value,
      "latitude" : this.validations_form.get("latitude").value,
      "longitude" : this.validations_form.get("longitude").value,
      "startDay" : parseInt(this.validations_form.get("startDay").value),
      "endDay" : parseInt(this.validations_form.get("endDay").value),
      "cost" : parseFloat(this.validations_form.get("cost").value),
      "maxMins" : parseInt(this.validations_form.get("maxMins").value),
      "availability" : 0,
      "purchaseStatus" : 0,
      "timeRemaining" : 0
    })
    // this.afDatabase.object("/meters/" + this.validations_form.get("name").value).push({
    //   "latitude" : this.validations_form.get("latitude").value,
    //   "longitude" : this.validations_form.get("longitude").value
    // })
    this.presentAlert()
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Meter Sent',
      subHeader: 'Meter with latitude: '
          + this.validations_form.get("latitude").value
          + " and longitude: "  + this.validations_form.get("longitude").value
          + " sent",
      buttons: ['OK']
    });
    await alert.present();
  }
}
