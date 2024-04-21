import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegistrationComponent } from './authentication/registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastComponent } from './toast/toast.component';
import { HeaderComponent } from './admin-panel/header/header.component';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { EditFlightComponent } from './admin-panel/dashboard/edit-flight/edit-flight.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ToastComponent,
    HeaderComponent,
    DashboardComponent,
    EditFlightComponent,
    AdminPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
