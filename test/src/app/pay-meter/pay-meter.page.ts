import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController, } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, range } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

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
  date: any;
  startTime: any;
  endTime: any;
  remMins: any;
  remSecs:any;
  cost: any;

  constructor(
    private navCtrl: NavController,
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

    this.endTime = [0,0,0,0]
    this.cost = ['0','0','0','0']
    
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
          if (meter['data']['address'] == this.meterName) {
            this.meterKey = meter.key;
            this.meter = meter.data
            console.log(this.meterKey)
            if (meter['data']['availability'] && !this.present) {
              this.presentAlert()
            }
            if (meter['data']['availability']) {
              var list = this.afDatabase.list("/meters/");
              list.update(this.meterKey, { purchaseStatus: 0, timeRemaining: 0});
            }
          }
        }

        this.date = new Date();
        this.remMins = Math.round(parseInt(this.meter.timeRemaining) / 60);
        var hours = this.date.getHours()
        if (hours > 12) {
          this.startTime = ('0' + (this.date.getHours()-12)).slice(-2) + ":" + ('0' + (this.date.getMinutes())).slice(-2) + " pm"
        } else {
          this.startTime = ('0' + (this.date.getHours())).slice(-2) + ":" + ('0' + (this.date.getMinutes())).slice(-2) + " am"
        }
        

        for (let i = 0; i < 4; i++) {
          var seconds = 15 * 60 * (i+1)
          this.date.setSeconds(this.date.getSeconds() + seconds)
          hours = this.date.getHours()
          if (hours > 12) {
            this.endTime[i] = ('0' + (this.date.getHours()-12)).slice(-2) + ":" + ('0' + (this.date.getMinutes())).slice(-2) + " pm"
          } else {
            this.endTime[i] = ('0' + (this.date.getHours())).slice(-2) + ":" + ('0' + (this.date.getMinutes())).slice(-2) + " am"
          }
          this.date = new Date();
        }

        for (let i = 0; i < 4; i++) {
          this.cost[i] = (this.meter.cost * (i+1)).toFixed(2)
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
      subHeader: 'You are not at this parking meter: ' + this.meter.address,
      message: 'Please park close to the meter and try again.',
      buttons: [
        {
          text: "Ok",
          handler: data => {
            this.navCtrl.back()
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
    var cost = this.meter.cost / 15
    var startTime = this.startTime
    var endTime
    if (selected == 'fifteen') {
      textToDisplay = '15 minutes'
      cost = cost * 15
      endTime = this.endTime[0]
    } else if (selected == 'thirty') {
      textToDisplay = '30 minutes'
      cost = cost * 30
      endTime = this.endTime[1]
    } else if (selected == 'fortyfive') {
      textToDisplay = '45 minutes'
      cost = cost * 45
      endTime = this.endTime[2]
    } else {
      textToDisplay = '60 minutes'
      cost = cost * 60
      endTime = this.endTime[3]
    }

    cost = (Math.round(cost * 100) / 100)
    var sCost = cost.toFixed(2)
    const alert = await this.alertController.create({
      header: 'Confirm Submission',
      subHeader: "You have selected to reserve this parking meter for " + textToDisplay + " at a cost of $" + sCost,
      message: 'Your time will run out at ' + endTime +'. Do you confirm?',
      buttons: [
        {
          text: "Pay Now",
          handler: data => {
            this.updateFirebase(textToDisplay, cost, startTime, endTime);
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
  updateFirebase(timeChosen, cost, startTime, endTime) {
    console.log("Updating database")
    var split = timeChosen.split(" ");
    var seconds = parseInt(split[0])*60
    var meters = this.afDatabase.list("/meters/");
        
    meters.update(this.meterKey, { 
                                  purchaseStatus: 1,
                                  timeRemaining: seconds,
                                  startTime: startTime,
                                  endTime: endTime,
                                  userId: this.authService.userDetails().uid
    });
    this.afDatabase.list(this.authService.userDetails().uid+"/transactions").push({
                                  meterKey: this.meterKey,
                                  address: this.meter.address,
                                  startTime: startTime,
                                  endTime: endTime,
                                  cost: cost,
    });

    this.navCtrl.navigateForward('dashboard', { replaceUrl: true })
    
  }

  ngOnDestroy() {
    this.getMeter.unsubscribe();
    clearInterval(this.interval);
  }

}
