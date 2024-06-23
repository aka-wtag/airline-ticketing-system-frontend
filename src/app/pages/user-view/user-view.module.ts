import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserViewComponent } from './user-view.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BookTicketComponent } from './flights/book-ticket/book-ticket.component';
import { FlightsComponent } from './flights/flights.component';
import { HomeComponent } from './home/home.component';
import { UserViewRoutingModule } from './user-view-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    UserViewComponent,
    NavbarComponent,
    BookTicketComponent,
    FlightsComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    UserViewRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserViewModule { }
