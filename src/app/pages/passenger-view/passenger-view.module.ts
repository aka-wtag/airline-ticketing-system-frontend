import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerViewRoutingModule } from './passenger-view-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingsComponent } from './bookings/bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    BookingsComponent, ProfileComponent
  ],
  imports: [
    CommonModule,
    PassengerViewRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PassengerViewModule { }
