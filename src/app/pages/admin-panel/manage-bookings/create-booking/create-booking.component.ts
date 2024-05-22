import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  @Output()
  bookingSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

  flights: Flight[] = [];
  passengers: Passenger[] = [];

  passengerSubscription: Subscription | undefined;
  flightSubscription: Subscription | undefined;

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
    this.getPassengers();
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

  onCloseForm() {
    this.closeForm.emit(false);
  }

  onFormSubmitted() {
    const requestBody = {
      flightId: this.bookingForm.value['flightId'],
      bookedSeats: this.bookingForm.value['bookedSeats'],
    };
    this.bookingService
      .createBooking(this.bookingForm.value['passengerId'], requestBody)
      .subscribe({
        next: () => {
          this.toastService.show('Booking added', true);
          this.bookingSuccess.emit();
        },
        error: (err) => {
          this.toastService.show(err, false);
        },
        complete: () => {
          this.closeForm.emit();
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
