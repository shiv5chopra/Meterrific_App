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
    'location': [
      { type: 'required', message: 'Location is required.' },
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
      location: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  sendMeter() {
    this.afDatabase.object("/meters/" + this.validations_form.get("name").value).update({
      "location" : this.validations_form.get("location").value
    })
    this.presentAlert()
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Meter Sent',
      subHeader: 'Meter with location: ' + this.validations_form.get("location").value + " sent",
      buttons: ['OK']
    });
    await alert.present();
  }
}
