import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Airline } from 'src/app/core/interface/airline';
import { AirlineService } from 'src/app/core/service/airline.service';
import { FlightService } from 'src/app/core/service/flight.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css'],
})
export class AddFlightComponent implements OnInit {
  flightForm!: FormGroup;
  airlines!: Airline[];

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
    this.airlineService.airlines$.subscribe((data) => {
      this.airlines = data;
    });

    this.airlineService.getAllAirlines().subscribe();
  }

  onSubmit() {
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
}
