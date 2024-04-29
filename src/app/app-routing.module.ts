import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassengerPageComponent } from './pages/passenger-page/passenger-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { PassengerGuard } from './core/guards/passenger.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { DashboardComponent } from './pages/admin-panel/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'passenger',
    component: PassengerPageComponent,
    canActivate: [AuthGuard, PassengerGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/admin-panel/admin-panel.module').then(
        (m) => m.AdminPanelModule
      ),
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
