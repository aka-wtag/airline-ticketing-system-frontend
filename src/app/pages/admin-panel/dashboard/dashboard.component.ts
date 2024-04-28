import { Component, OnInit } from '@angular/core';
import { Airline } from 'src/app/core/interface/airline';
import { Flight } from 'src/app/core/interface/flight';
import { Passenger } from 'src/app/core/interface/passenger';
import { AirlineService } from 'src/app/core/service/airline.service';
import { FlightService } from 'src/app/core/service/flight.service';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  passengers: Passenger[] = [];
  airlines: Airline[] = [];
  flights: Flight[] = [];

  showEditFlightForm: boolean = false;
  selectedFlight: Flight | null | undefined;

  constructor(
    private passengerService: PassengerService,
    private flightService: FlightService,
    private airlineService: AirlineService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.passengerService.passengers$.subscribe((data) => {
      this.passengers = data;
    });

    this.passengerService.getAllPassengers().subscribe();

    
    this.flightService.flights$.subscribe((data) => {
      this.flights = data;
    });

    this.flightService.getAllFlights().subscribe();

    this.airlineService.airlines$.subscribe((data) => {
      this.airlines = data;
    });

    this.airlineService.getAllAirlines().subscribe();
  }
  
  closeEditFlightForm() {
    this.showEditFlightForm = false;
    this.selectedFlight = null;
  }

  editFlightForm(flight: Flight) {
    this.showEditFlightForm = true;
    this.selectedFlight = flight;
  }

  deleteFlight(flightId: number) {
    this.flightService.deleteflight(flightId).subscribe({
      next: () => {
        this.toastService.show('Deleted flight', true);
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }
}
