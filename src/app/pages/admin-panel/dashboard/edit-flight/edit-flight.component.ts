import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Airline } from 'src/app/core/interface/airline';
import { Flight } from 'src/app/core/interface/flight';
import { FlightService } from 'src/app/core/service/flight.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css'],
})
export class EditFlightComponent implements OnInit {
  editFlightForm: FormGroup;

  @Input() selectedFlight: Flight | undefined | null;
  @Input() airlines: Airline[] = [];

  @Output()
  closeForm: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  updateSuccess: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private flightService: FlightService,
    private toastService: ToastService
  ) {
    this.editFlightForm = new FormGroup({
      fare: new FormControl(null, [Validators.required, Validators.min(1000)]),
      airlineId: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.editFlightForm.patchValue({
      fare: this.selectedFlight?.fare,
      airlineId: this.selectedFlight?.airline.airlineId,
    });
  }

  onCloseForm() {
    this.closeForm.emit();
  }

  onFormSubmitted() {
    this.flightService
      .updateFlight(this.editFlightForm.value, this.selectedFlight?.flightId)
      .subscribe({
        next: () => {
          this.toastService.show('Update successful', true);
          this.updateSuccess.emit();
          this.closeForm.emit();
        },
        error: (err) => {
          this.toastService.show(err, false);
        },
      });
  }

  isValid(key: string, validatorType: string): boolean {
    return (
      this.editFlightForm.get(key)?.errors?.[validatorType] &&
      this.editFlightForm.get(key)?.touched
    );
  }
}
