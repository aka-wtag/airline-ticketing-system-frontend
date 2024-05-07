import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Flight } from 'src/app/core/interface/flight';
import { Passenger } from 'src/app/core/interface/passenger';
import { BookingService } from 'src/app/core/service/booking.service';
import { FlightService } from 'src/app/core/service/flight.service';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css'],
})
export class CreateBookingComponent implements OnInit {
  bookingForm: FormGroup;

  @Output()
  closeForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  flights: Flight[] = [];
  passengers: Passenger[] = [];

  constructor(
    private flightService: FlightService,
    private passengerService: PassengerService,
    private bookingService: BookingService,
    private toastService: ToastService
  ) {
    this.bookingForm = new FormGroup({
      passengerId: new FormControl(null, [Validators.required]),
      flightId: new FormControl(null, [Validators.required]),
      bookedSeats: new FormControl(null, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  ngOnInit(): void {
    this.flightService.flights$.subscribe((data) => {
      this.flights = data;
    });

    this.flightService.getAllFlights().subscribe();

    this.passengerService.passengers$.subscribe((data) => {
      this.passengers = data;
    });

    this.passengerService.getAllPassengers().subscribe();
  }

  onCloseForm() {
    this.closeForm.emit(false);
  }

  onFormSubmitted() {
    const requestBody = {
      flightId: this.bookingForm.value['flightId'],
      bookedSeats: this.bookingForm.value['bookedSeats'],
    };
    console.log(this.bookingForm.value);
    this.bookingService
      .createBooking(this.bookingForm.value['passengerId'], requestBody)
      .subscribe({
        next: () => {
          this.toastService.show('Booking added', true);
        },
        error: (err) => {
          this.toastService.show(err, false);
        },
        complete: () => {
          this.closeForm.emit(false);
        },
      });
  }

  isValid(key: string, validatorType: string): boolean {
    return (
      this.bookingForm.get(key)?.errors?.[validatorType] &&
      this.bookingForm.get(key)?.touched
    );
  }
}
