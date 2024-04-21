import { Component, Input, OnInit } from '@angular/core';
import { AirlineService } from 'src/app/service/airline.service';
import { FlightService } from 'src/app/service/flight.service';
import { PassengerService } from 'src/app/service/passenger.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  passengers: any[];
  airlines: any[];
  flights: any[];

  showEditFlightForm: boolean = false;
  selectedFlight: any;

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

    this.passengerService.getAllPassengers();

    this.flightService.flights$.subscribe((data) => {
      this.flights = data;
    });

    this.flightService.getAllFlights();

    this.airlineService.airlines$.subscribe((data) => {
      this.airlines = data;
    });

    this.airlineService.getAllAirlines();
  }

  closeEditFlightForm() {
    this.showEditFlightForm = false;
    this.selectedFlight = null;
  }

  editFlightForm(flight: any) {
    this.showEditFlightForm = true;
    this.selectedFlight = flight;
  }

  deleteFlight(flightId: number) {
    this.flightService.deleteflight(flightId).subscribe({
      next: () => {
        this.toastService.show('Deleted flight', true);
      },
      error: () => {
        this.toastService.show('Deletion failed', false);
      },
    });
  }
}
