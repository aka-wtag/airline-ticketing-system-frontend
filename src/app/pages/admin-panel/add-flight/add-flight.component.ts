import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Airline } from 'src/app/core/interface/airline';
import { AirlineService } from 'src/app/core/service/airline.service';
import { FlightService } from 'src/app/core/service/flight.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css'],
})
export class AddFlightComponent implements OnInit, OnDestroy {
  flightForm: FormGroup;
  airlines!: Airline[];
  sources!: string[];
  destinations!: string[];

  airlineSubscription: Subscription | undefined;

  constructor(
    private airlineService: AirlineService,
    private flightService: FlightService,
    private toastService: ToastService
  ) {
    this.flightForm = new FormGroup({
      departureDate: new FormControl('', [Validators.required]),
      departureTime: new FormControl('', [Validators.required]),
      arrivalDate: new FormControl('', [Validators.required]),
      arrivalTime: new FormControl('', [Validators.required]),
      departureLocation: new FormControl('', [Validators.required]),
      arrivalLocation: new FormControl('', [Validators.required]),
      fare: new FormControl('', [Validators.required, Validators.min(1000)]),
      airlineId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAirlines();

    this.sources = ['Dhaka', 'Chittagong', 'Sylhet', 'Florida', 'Toronto'];

    this.destinations = ['Dhaka', 'Chittagong', 'Sylhet', 'Florida', 'Toronto'];
  }

  getAirlines(): void {
    this.airlineSubscription = this.airlineService.getAllAirlines().subscribe({
      next: (data: any) => {
        this.airlines = data.content as Airline[];
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  onSubmit(): void {
    this.flightService.createFlight(this.flightForm.value).subscribe({
      next: () => {
        this.toastService.show('Flight added', true);

        this.flightForm.reset();
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  isValid(key: string, validatorType: string): boolean {
    return (
      this.flightForm.get(key)?.errors?.[validatorType] &&
      this.flightForm.get(key)?.touched
    );
  }

  ngOnDestroy(): void {
    if (this.airlineSubscription) {
      this.airlineSubscription.unsubscribe();
    }
  }
}
