import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditFlightComponent } from './dashboard/edit-flight/edit-flight.component';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AddFlightComponent } from './add-flight/add-flight.component';
import { ManageAirlinesComponent } from './manage-airlines/manage-airlines.component';
import { AddEditAirlineComponent } from './manage-airlines/add-edit-airline/add-edit-airline.component';
import { FlightDetailsComponent } from './manage-bookings/flight-details/flight-details.component';
import { ManageBookingsComponent } from './manage-bookings/manage-bookings.component';
import { ManagePassengersComponent } from './manage-passengers/manage-passengers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateBookingComponent } from './manage-bookings/create-booking/create-booking.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AdminPanelComponent,
    HeaderComponent,
    DashboardComponent,
    EditFlightComponent,
    AddFlightComponent,
    ManageAirlinesComponent,
    AddEditAirlineComponent,
    FlightDetailsComponent,
    ManageBookingsComponent,
    ManagePassengersComponent,
    CreateBookingComponent,
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
  ],
})
export class AdminPanelModule {}
