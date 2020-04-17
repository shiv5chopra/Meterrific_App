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
  public interval: any;
  getMeter: any;

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
    var obj = "/meters/" + this.meterName
    if (!this.meterName) {
      this.router.navigate(['navigation'])
    }

    // this.patientPics$ =
    this.getMeter = this.afDatabase.list("/meters").snapshotChanges()
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
            this.meter = meter.data
            console.log(this.meterKey)
            if (meter.data.availability && !this.present) {
              this.presentAlert()
            }
            if (meter.data.availability) {
              var list = this.afDatabase.list("/meters/");
              list.update(this.meterKey, { purchaseStatus: 0, timeRemaining: 0});
            }
          }
        }
      })

    // this.interval = setInterval(() => {
    //     this.main();
    // }, 500);
    
  }

  main() {
    
    // if (this.meterKey) {
    //   this.afDatabase.list("/meters/"+this.meterKey).valueChanges().subscribe((data) => {
    //     console.log(data)
    //     if (data[0] && !this.present) {
    //       this.presentAlert()
    //     }
    //     if (data[0]) {
    //       var meters = this.afDatabase.list("/meters/");
    //       meters.update(this.meterName, { purchaseStatus: 0});
    //     }
    //   })
    //   clearInterval(this.interval);
    // }
  }


  async presentAlert() {
    this.present = 1
    const alert = await this.alertController.create({
      header: 'Meter Empty',
      subHeader: 'You have left the meter near: ' + this.meter.address,
      message: 'We have reset your time, if this is a mistake contact support',
      buttons: [
        {
          text: "Ok",
          handler: data => {
            this.router.navigate(['navigation'])
          }
        }
        // ,
        // {
        //   text: "No",
        //   handler: data => {
        //     this.present = 0
        //   }
        // }
      ]
    });
    await alert.present();
  }

  /**
   * Displays an alert that notifies the user of their selection
   * @param selected the amount of time selected to park at the meter as a string
   */
  async displayChoice(selected) {
    var textToDisplay
    if (selected == 'fifteen') {
      textToDisplay = '15 minutes'
    } else if (selected == 'thirty') {
      textToDisplay = '30 minutes'
    } else if (selected == 'fortyfive') {
      textToDisplay = '45 minutes'
    } else {
      textToDisplay = '60 minutes'
    }
    const alert = await this.alertController.create({
      header: 'Confirm Submission',
      subHeader: "You have selected to reserve this parking meter for " + textToDisplay + " at a cost of ",
      message: 'Is this correct?',
      buttons: [
        {
          text: "Pay Now",
          handler: data => {
            this.updateFirebase(textToDisplay);
          }
        }, 
        'Cancel'
      ]
    });
    await alert.present();
  }

  /**
   * If the user confirmed the selection, the update the database
   * to reflect the chosen meter's purchase status and time remaining
   * @param timeChosen the amount of time the user selected for parking written as a string
   * e.g. "15 minutes"
   */
  updateFirebase(timeChosen) {
    console.log("Updating database")
    var split = timeChosen.split(" ");
    var num = parseInt(split[0])*60
    var meters = this.afDatabase.list("/meters/");
    meters.update(this.meterKey, { purchaseStatus: 1,timeRemaining: num });
  }

  ngOnDestroy() {
    this.getMeter.unsubscribe();
    clearInterval(this.interval);
  }

}
