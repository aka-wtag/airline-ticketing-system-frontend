import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassengerPageComponent } from './pages/passenger-page/passenger-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { PassengerGuard } from './core/guards/passenger.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

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
    path: 'dashboard',
    component: AdminPanelComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
