import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {
  public transactions$ : Observable<any[]>;


  constructor(
    private authService: AuthenticationService,
    private afDatabase : AngularFireDatabase) { }

  ngOnInit() {
    this.transactions$ = this.afDatabase.list(this.authService.userDetails().uid+"/transactions").snapshotChanges()
  }

}
