import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Airline } from 'src/app/core/interface/airline';
import { Flight } from 'src/app/core/interface/flight';
import { Passenger } from 'src/app/core/interface/passenger';
import { AirlineService } from 'src/app/core/service/airline.service';
import { FlightService } from 'src/app/core/service/flight.service';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { EDIT_ICON } from 'src/app/core/constants/icons';
import { DELETE_ICON } from 'src/app/core/constants/icons';
import { ICON_HEIGHT, ICON_WIDTH } from 'src/app/core/constants/variables';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  passengers: Passenger[] = [];
  airlines: Airline[] = [];
  flights: Flight[] = [];

  showEditFlightForm: boolean = false;
  selectedFlight: Flight | undefined;

  passengerSubscription: Subscription | undefined;
  flightSubscription: Subscription | undefined;
  airlineSubscription: Subscription | undefined;

  editIcon = EDIT_ICON;
  deleteIcon = DELETE_ICON;

  iconWidth = ICON_WIDTH;
  iconHeight = ICON_HEIGHT;

  isConfirmationModalOpen: boolean = false;

  constructor(
    private passengerService: PassengerService,
    private flightService: FlightService,
    private airlineService: AirlineService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getPassengers();
    this.getAirlines();
    this.getFlights();
  }

  getPassengers() {
    this.passengerSubscription = this.passengerService
      .getAllPassengers()
      .subscribe({
        next: (data) => {
          this.passengers = data as Passenger[];
        },
        error: (err) => {
          this.toastService.show(err, false);
        },
      });
  }

  getFlights() {
    this.passengerSubscription = this.flightService.getAllFlights().subscribe({
      next: (data) => {
        this.flights = data as Flight[];
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  getAirlines() {
    this.airlineSubscription = this.airlineService.getAllAirlines().subscribe({
      next: (data: Airline[]) => {
        this.airlines = data;
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  closeEditFlightForm() {
    this.showEditFlightForm = false;
  }

  getFlightsOnSuccess() {
    this.getFlights();
  }

  editFlightForm(flight: Flight) {
    this.showEditFlightForm = true;
    this.selectedFlight = flight;
  }

  deleteFlight(flightId: number) {
    this.flightService.deleteflight(flightId).subscribe({
      next: () => {
        this.getFlights();

        this.toastService.show('Deleted flight', true);
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  openConfirmationModal(flight: Flight) {
    this.selectedFlight = flight;
    this.isConfirmationModalOpen = true;
  }

  closeConfirmationModal(confirmed: boolean) {
    this.isConfirmationModalOpen = false;
    if (confirmed) {
      this.deleteFlight(this.selectedFlight!.flightId);
    }
  }

  onDeleteConfirmation(confirmed: boolean) {
    this.closeConfirmationModal(confirmed);
  }

  ngOnDestroy(): void {
    if (this.passengerSubscription) {
      this.passengerSubscription.unsubscribe();
    }

    if (this.flightSubscription) {
      this.flightSubscription.unsubscribe();
    }

    if (this.airlineSubscription) {
      this.airlineSubscription.unsubscribe();
    }
  }
}
