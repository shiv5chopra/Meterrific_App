import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController, } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-pay-meter',
  templateUrl: './pay-meter.page.html',
  styleUrls: ['./pay-meter.page.scss'],
})
export class PayMeterPage implements OnInit {
  meter: any;
  meterName: any;
  present: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private afDatabase : AngularFireDatabase,
    private alertController : AlertController) {
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.meterName = this.router.getCurrentNavigation().extras.state.meter;
        }
      });
    }

  ngOnInit() {
    if (!this.meterName) {
      this.router.navigate(['navigation'])
    }
    this.afDatabase.list("/meters/").valueChanges().subscribe((data) => {
      
      for (let item of data) {
        console.log(item)
        if (item['name'] == this.meterName) {
          this.meter = item
        }
      }
      if (this.meter.availability && !this.present) {
        this.presentAlert()
      }
    });
    
  }

  async presentAlert() {
    this.present = 1
    const alert = await this.alertController.create({
      header: 'Meter Empty',
      subHeader: 'You have left meter: ' + this.meter.name,
      message: 'Go back to navigation page page?',
      buttons: [
        {
          text: "Yes",
          handler: data => {
            this.router.navigate(['navigation'])
          }
        },
        {
          text: "No",
          handler: data => {
            this.present = 0
          }
        }
      ]
    });
    await alert.present();
  }

}
