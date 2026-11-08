import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PassengerGuard } from 'src/app/core/guards/passenger.guard';
import { BookingsComponent } from './bookings/bookings.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard, PassengerGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, PassengerGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassengerViewRoutingModule { }
