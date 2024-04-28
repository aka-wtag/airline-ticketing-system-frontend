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

  @Output()
  closeForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  airlines: Airline[] = [];

  constructor(
    private airlineService: AirlineService,
    private flightService: FlightService,
    private toastService: ToastService
  ) {
    this.editFlightForm = new FormGroup({
      fare: new FormControl(null, [Validators.required, Validators.min(1000)]),
      airlineId: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.airlineService.airlines$.subscribe((data) => {
      this.airlines = data;
    });

    this.editFlightForm.patchValue({
      fare: this.selectedFlight?.fare,
      airlineId: this.selectedFlight?.airline.airlineId,
    });
  }

  onCloseForm() {
    this.closeForm.emit(false);
  }

  onFormSubmitted() {
    this.flightService
      .updateFlight(this.editFlightForm.value, this.selectedFlight?.flightId)
      .subscribe({
        next: () => {
          this.toastService.show('Update successful', true);
        },
        error: (err) => {
          this.toastService.show(err, false);
        },
        complete: () => {
          this.closeForm.emit(false);
        },
      });
  }
}
