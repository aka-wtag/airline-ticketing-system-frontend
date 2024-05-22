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

  constructor(
    private bookingService: BookingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings() {
    this.bookingSubscription = this.bookingService
      .getAllBookings()
      .subscribe({
        next: (data) => {
          this.bookings = data as Booking[];
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

  deleteBooking(passengerId: number, flightId: number) {
    this.bookingService.deleteBooking(passengerId, flightId).subscribe({
      next: () => {
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

  getAllBookingsOnSuccess(){
    this.getBookings()
  }
}
