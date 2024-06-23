import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BookingCreateRequest } from 'src/app/core/interface/booking-create-request';
import { BookingService } from 'src/app/core/service/booking.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css']
})
export class BookTicketComponent {

  bookingForm: FormGroup;

  @Input() passengerId!: number;
  @Input() flightId!: number;

  @Output()
  closeForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private bookingService: BookingService,
    private toastService: ToastService
  ) {
    this.bookingForm = new FormGroup({
      bookedSeats: new FormControl(null, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  onCloseForm(): void {
    this.closeForm.emit();
  }

  onFormSubmitted(): void {
    const requestBody: BookingCreateRequest = {
      flightId: this.flightId,
      bookedSeats: this.bookingForm.value['bookedSeats'],
    };
    this.bookingService
      .createBooking(this.passengerId, requestBody)
      .subscribe({
        next: () => {
          this.toastService.show('Booked Flight', true);
        },
        error: (err: string) => {
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
