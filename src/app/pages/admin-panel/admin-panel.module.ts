import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditFlightComponent } from './dashboard/edit-flight/edit-flight.component';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';

@NgModule({
  declarations: [
    AdminPanelComponent,
    HeaderComponent,
    DashboardComponent,
    EditFlightComponent,
  ],
  imports: [CommonModule, AdminPanelRoutingModule, ReactiveFormsModule],
})
export class AdminPanelModule {}
