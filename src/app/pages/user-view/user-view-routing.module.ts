import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserViewComponent } from './user-view.component';
import { HomeComponent } from './home/home.component';
import { FlightsComponent } from './flights/flights.component';
import { PassengerGuard } from 'src/app/core/guards/passenger.guard';

const routes: Routes = [
  {
    path: '',
    component: UserViewComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'flights', component: FlightsComponent },
    ],
  },

  {
    path: '',
    component: UserViewComponent,
    loadChildren: () =>
      import('../authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: '',
    component: UserViewComponent,
    canLoad: [AuthGuard, PassengerGuard],
    loadChildren: () =>
      import('../passenger-view/passenger-view.module').then(
        (m) => m.PassengerViewModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserViewRoutingModule { }
