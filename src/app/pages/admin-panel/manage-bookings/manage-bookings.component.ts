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
  selectedFlight: Flight | null = null;

  showBookingForm: boolean = false;

  bookingSubscription: Subscription | undefined;

  isConfirmationModalOpen: boolean = false;

  selectedBooking: Booking | undefined;

  constructor(
    private bookingService: BookingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings() {
    this.bookingSubscription = this.bookingService.getAllBookings().subscribe({
      next: (data: Booking[]) => {
        this.bookings = data;
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  showFlightDetails(flight: any) {
    this.showFlight = true;
    this.selectedFlight = flight;
  }

  hideFlightDetails() {
    this.showFlight = false;
  }

  deleteBooking(passengerId: number, flightId: number): void {
    this.bookingService.deleteBooking(passengerId, flightId).subscribe({
      next: () => {
        this.getBookings();

        this.toastService.show('Booking deleted', true);
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  closeBookingForm() {
    this.showBookingForm = !this.showBookingForm;
  }
  
  openConfirmationModal(booking: Booking) {
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
}
