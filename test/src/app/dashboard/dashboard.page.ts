import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
 
 
  public userEmail: string
  public admin: string
 
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private afDatabase : AngularFireDatabase
  ) {}
  
  

  ngOnInit(){
    
    if(this.authService.userDetails()){
      this.userEmail = this.authService.userDetails().email;

    }else{
      this.navCtrl.navigateBack('');
    }

    this.afDatabase.object(this.authService.userDetails().uid).valueChanges().subscribe((user : any) => {
      this.admin = user.userType
    })
  }
 
  logout(){
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
    })
    .catch(error => {
      console.log(error);
    })
  }

  goToNavigationPage() {
    this.navCtrl.navigateForward('/navigation')
  }

  goToAddMetersPage() {
    this.navCtrl.navigateForward('/add-meters')
  }

  
}