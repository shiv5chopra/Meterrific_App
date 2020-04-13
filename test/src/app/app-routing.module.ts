import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'status',
    loadChildren: () => import('./status/status.module').then( m => m.StatusPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'navigation',
    loadChildren: () => import('./navigation/navigation.module').then( m => m.NavigationPageModule)
  },
  {
    path: 'input-destination',
    loadChildren: () => import('./input-destination/input-destination.module').then( m => m.InputDestinationPageModule)
  },
  {
    path: 'transaction-history',
    loadChildren: () => import('./transaction-history/transaction-history.module').then( m => m.TransactionHistoryPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'add-meters',
    loadChildren: () => import('./add-meters/add-meters.module').then( m => m.AddMetersPageModule)
  },
  {
    path: 'pay-meter',
    loadChildren: () => import('./pay-meter/pay-meter.module').then( m => m.PayMeterPageModule)
  },

  //{ path: "hihi", loadChildren: './hihi/hihi.module#HihiModule'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
