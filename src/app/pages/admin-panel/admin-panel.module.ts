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

@NgModule({
  declarations: [
    AdminPanelComponent,
    HeaderComponent,
    DashboardComponent,
    EditFlightComponent,
    AddFlightComponent,
    ManageAirlinesComponent,
    AddEditAirlineComponent,
  ],
  imports: [CommonModule, AdminPanelRoutingModule, ReactiveFormsModule],
})
export class AdminPanelModule {}
