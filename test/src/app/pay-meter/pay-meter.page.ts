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
  meterID: any;
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
          this.meterID = this.router.getCurrentNavigation().extras.state.meter;
        }
      });
    }

  ngOnInit() {
    var obj = "/meters/" + this.meterID
    if (!this.meterID) {
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
          if (meter.data.address == this.meterID) {
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
      if (this.meter.availability) {
        var meters = this.afDatabase.list("/meters/");
        meters.update(this.meterID, { purchaseStatus: 0});
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
      subHeader: 'You have left the meter near: ' + this.meter.address,
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
    var num = parseInt(split[0])
    var meters = this.afDatabase.list("/meters/");
    meters.update(this.meterID, { purchaseStatus: 1 });
    meters.update(this.meterID, { timeRemaining: num });
  }

}
