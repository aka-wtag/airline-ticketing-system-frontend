import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/core/interface/booking';
import { Flight } from 'src/app/core/interface/flight';
import { BookingService } from 'src/app/core/service/booking.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css'],
})
export class ManageBookingsComponent implements OnInit {
  bookings: Booking[] = [];

  showFlight: boolean = false;
  selectedFlight!: Flight;

  showBookingForm: boolean = false;

  bookingSubscription: Subscription | undefined;

  isConfirmationModalOpen: boolean = false;

  selectedBooking: Booking | undefined;

  currentPage = 1;
  itemsPerPage = 3;
  totalItems = 0;

  constructor(
    private bookingService: BookingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService
      .getBookings(this.currentPage - 1, this.itemsPerPage)
      .subscribe({
        next: (response: any) => {
          this.bookings = response.content;
          this.totalItems = response.totalElements;
        },
        error: (err) => {
          this.toastService.show(err, false);
        },
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadBookings();
  }

  showFlightDetails(flight: Flight): void {
    this.showFlight = true;
    this.selectedFlight = flight;
  }

  hideFlightDetails(): void {
    this.showFlight = false;
  }

  deleteBooking(passengerId: number, flightId: number): void {
    this.bookingService.deleteBooking(passengerId, flightId).subscribe({
      next: () => {
        this.loadBookings();

        this.toastService.show('Booking deleted', true);
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  closeBookingForm(): void {
    this.showBookingForm = !this.showBookingForm;
  }

  openConfirmationModal(booking: Booking): void {
    this.selectedBooking = booking;
    this.isConfirmationModalOpen = true;
  }

  closeConfirmationModal(confirmed: boolean): void {
    this.isConfirmationModalOpen = false;
    if (confirmed) {
      this.deleteBooking(
        this.selectedBooking!.passenger.userId,
        this.selectedBooking!.bookingNumber
      );
    }
  }

  onDeleteConfirmation(confirmed: boolean): void {
    this.closeConfirmationModal(confirmed);
  }

  ngOnDestroy(): void {
    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
  }
}
