import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/core/interface/booking';
import { User } from 'src/app/core/interface/user';
import { AuthService } from 'src/app/core/service/auth.service';
import { BookingService } from 'src/app/core/service/booking.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent implements OnInit, OnDestroy {
  passengerBookingsSubscription: Subscription | undefined;

  passengerBookings: Booking[] = [];

  isConfirmationModalOpen: boolean = false;

  selectedBooking: Booking | undefined;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getPassengerBookings();
  }

  getPassengerBookings(): void {
    this.passengerBookingsSubscription = this.bookingService
      .getPassengerBookings(this.authService.getUserId()!)
      .subscribe({
        next: (data) => {
          this.passengerBookings = data as Booking[];
        },
        error: (err: string) => {
          this.toastService.show(err, false);
        },
      });
  }

  getStatus(booking: Booking): string {
    const currentDateTime = new Date();
    const departureDateTime = new Date(
      booking.flight.departureDate + 'T' + booking.flight.departureTime
    );
    const arrivalDateTime = new Date(
      booking.flight.arrivalDate + 'T' + booking.flight.arrivalTime
    );

    if (arrivalDateTime <= currentDateTime) {
      return 'Arrived';
    } else if (departureDateTime <= currentDateTime) {
      return 'Departed';
    } else {
      return 'Pending';
    }
  }

  shouldShowCancelButton(booking: Booking): boolean {
    const currentDateTime = new Date();
    const departureDateTime = new Date(
      booking.flight.departureDate + 'T' + booking.flight.departureTime
    );
    return departureDateTime > currentDateTime;
  }

  openConfirmationModal(booking: Booking): void {
    this.selectedBooking = booking;
    this.isConfirmationModalOpen = true;
  }

  onDeleteConfirmation(confirmed: boolean): void {
    this.closeConfirmationModal(confirmed);
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

  deleteBooking(passengerId: number, flightId: number): void {
    this.bookingService.deleteBooking(passengerId, flightId).subscribe({
      next: () => {
        this.getPassengerBookings();

        this.toastService.show('Booking deleted', true);
      },
      error: (err: string) => {
        this.toastService.show(err, false);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.passengerBookingsSubscription) {
      this.passengerBookingsSubscription.unsubscribe();
    }
  }
}
