import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'map', component: MapComponent },
    ]
  },
  { path: '**', redirectTo: '' } // Catch all unmatched routes
];
