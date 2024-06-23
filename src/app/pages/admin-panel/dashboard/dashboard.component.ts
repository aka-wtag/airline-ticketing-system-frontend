import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Flight } from 'src/app/core/interface/flight';
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
  totalAirlines!: number;
  totalPassengers!: number;
  totalFlights!: number;

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

  currentPage = 1;
  itemsPerPage = 2;
  totalItems = 0;

  constructor(
    private passengerService: PassengerService,
    private flightService: FlightService,
    private airlineService: AirlineService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadtotalAirlines();
    this.loadtotalPassengers();
    this.loadFlights();
  }

  loadtotalAirlines(): void {
    this.airlineService.getAirlines(0, 1).subscribe((response: any) => {
      this.totalAirlines = response.totalElements;
    });
  }

  loadtotalPassengers(): void {
    this.passengerService.getPassengers(0, 1).subscribe((response: any) => {
      this.totalPassengers = response.totalElements;
    });
  }

  loadFlights(): void {
    this.flightService
      .getFlights(this.currentPage - 1, this.itemsPerPage)
      .subscribe((response: any) => {
        this.flights = response.content;
        this.totalItems = response.totalElements;
        this.totalFlights = response.totalElements;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFlights();
  }

  closeEditFlightForm(): void {
    this.showEditFlightForm = false;
  }

  editFlightForm(flight: Flight): void {
    this.showEditFlightForm = true;
    this.selectedFlight = flight;
  }

  deleteFlight(flightId: number): void {
    this.flightService.deleteflight(flightId).subscribe({
      next: () => {
        this.loadFlights();

        this.toastService.show('Deleted flight', true);
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  openConfirmationModal(flight: Flight): void {
    this.selectedFlight = flight;
    this.isConfirmationModalOpen = true;
  }

  closeConfirmationModal(confirmed: boolean): void {
    this.isConfirmationModalOpen = false;
    if (confirmed) {
      this.deleteFlight(this.selectedFlight!.flightId);
    }
  }

  onDeleteConfirmation(confirmed: boolean): void {
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
