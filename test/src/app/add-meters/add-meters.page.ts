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
    'name': [
      { type: 'required', message: 'Name is required.' },
    ],
    'latitude': [
      { type: 'required', message: 'Latitude is required.' },
    ],
    'longitude': [
      { type: 'required', message: 'Longitude is required.' },
    ]
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private afDatabase : AngularFireDatabase,
    private alertController : AlertController) { }

  ngOnInit(){
    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      latitude: new FormControl('', Validators.compose([
        Validators.required
      ])),
      longitude: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  sendMeter() {

    this.afDatabase.database.ref("/meters/").push({
      "name" : this.validations_form.get("name").value,
      "latitude" : this.validations_form.get("latitude").value,
      "longitude" : this.validations_form.get("longitude").value
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
