import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Airline } from 'src/app/core/interface/airline';
import { Flight } from 'src/app/core/interface/flight';
import { AirlineService } from 'src/app/core/service/airline.service';
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

  airlines: Airline[] = [];

  @Output()
  closeForm: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  updateSuccess: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private flightService: FlightService,
    private toastService: ToastService,
    private airlineService: AirlineService
  ) {
    this.editFlightForm = new FormGroup({
      fare: new FormControl(null, [Validators.required, Validators.min(1000)]),
      airlineId: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadAirlines();

    this.editFlightForm.patchValue({
      fare: this.selectedFlight?.fare,
      airlineId: this.selectedFlight?.airline.airlineId,
    });
  }

  loadAirlines(): void {
    this.airlineService
      .getAllAirlines()
      .subscribe((response: any) => {
        this.airlines = response.content;
      });
  }


  onCloseForm(): void {
    this.closeForm.emit();
  }

  onFormSubmitted(): void {
    this.flightService
      .updateFlight(this.editFlightForm.value, this.selectedFlight!.flightId)
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
