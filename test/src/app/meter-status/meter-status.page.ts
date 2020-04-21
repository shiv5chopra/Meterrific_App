import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-meter-status',
  templateUrl: './meter-status.page.html',
  styleUrls: ['./meter-status.page.scss'],
})
export class MeterStatusPage implements OnInit {
  meter: any
  remMins: any
  constructor(
    private authService: AuthenticationService,
    private afDatabase : AngularFireDatabase) { }

  ngOnInit() {
    this.afDatabase.list("/meters").valueChanges().subscribe((data) => {
      var changed = 0
      for (let item of data) {
        if (item["userId"] == this.authService.userDetails().uid) {
          this.meter = item
          this.remMins = Math.round(this.meter["timeRemaining"]/60)
          changed = 1
        }  
      }

      if (changed == 0) {
        this.meter = null
      }
           
    })
  }

}
