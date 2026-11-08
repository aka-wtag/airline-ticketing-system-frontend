import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { AdminGuard } from 'src/app/core/guards/admin.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddFlightComponent } from './add-flight/add-flight.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'add-flight', component: AddFlightComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
