import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Flight } from 'src/app/core/interface/flight';
import { User } from 'src/app/core/interface/user';
import { AuthService } from 'src/app/core/service/auth.service';
import { FlightService } from 'src/app/core/service/flight.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent {
  flights: Flight[] = [];

  searchFlightForm: FormGroup;

  showBookingForm: boolean = false;

  authenticatedUser!: User;

  selectedFlightId!: number;

  constructor(private flightService: FlightService, private authService: AuthService, private router: Router) {
    this.searchFlightForm = new FormGroup({
      departureLocation: new FormControl(''),
      arrivalLocation: new FormControl(''),
      departureDate: new FormControl('')
    });
  }

  ngOnInit(){
    this.authService.authenticatedUser.subscribe((data) => {
      this.authenticatedUser = data as User;
    })
  }

  onSearch(): void {
    this.flightService.getSearchedFlights(this.searchFlightForm.value).subscribe((response) => {
      this.flights = response as Flight[];
    })
  }

  closeBookingForm(): void {
    this.showBookingForm = !this.showBookingForm;
  }

  handleBookingModal(flightId: number): void{
    if(this.authenticatedUser){
      this.selectedFlightId = flightId;
      this.showBookingForm = true;
    }
    else{
      this.router.navigate(['/login']);
    }
  }
}
