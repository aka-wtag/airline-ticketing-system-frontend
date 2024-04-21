import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegistrationComponent } from './authentication/registration/registration.component';
import { PassengerPageComponent } from './passenger-page/passenger-page.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { AddFlightComponent } from './admin-panel/add-flight/add-flight.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'passenger-page', component: PassengerPageComponent },
  {
    path: '',
    component: AdminPanelComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [{ path: '', component: DashboardComponent }, { path: 'add-flight', component: AddFlightComponent },],
  },
  // { path: '**', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
