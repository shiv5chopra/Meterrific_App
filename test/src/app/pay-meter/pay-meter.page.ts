import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController, } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pay-meter',
  templateUrl: './pay-meter.page.html',
  styleUrls: ['./pay-meter.page.scss'],
})
export class PayMeterPage implements OnInit {
  meter: any;
  meterName: any;
  present: any;
  meterKey: any;
  public patientPics$: Observable<any[]>;

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
    // this.patientPics$ =
   this.afDatabase.list("/meters").snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.val();
            const key = a.payload.key;
            // console.log(key)
            return { key, data };
          });
        })
      ).subscribe(meters => {
        // let meter = <any>{}
        for(let meter of meters) {
          if (meter.data.address == this.meterName) {
            this.meterKey = meter.key;
            console.log(this.meterKey)
          }
        }
      })
    this.afDatabase.list("/meters/"+this.meterKey).valueChanges().subscribe((data) => {
      console
      if (data.availability && !this.present) {
        this.presentAlert()
      } 
    })
    this.main()
    
  }

  main() {
    // this.patientPics$.forEach(element => {
    //   console.log(element)
      
    // });
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
