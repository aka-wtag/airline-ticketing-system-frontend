import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastComponent } from './shared/toast/toast.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { PassengerPageComponent } from './pages/passenger-page/passenger-page.component';
import { HeaderComponent } from './pages/admin-panel/header/header.component';
import { DashboardComponent } from './pages/admin-panel/dashboard/dashboard.component';
import { EditFlightComponent } from './pages/admin-panel/dashboard/edit-flight/edit-flight.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    AdminPanelComponent,
    PassengerPageComponent,
    UnauthorizedComponent,
    HeaderComponent,
    DashboardComponent,
    EditFlightComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
