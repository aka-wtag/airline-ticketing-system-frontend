import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AirlineService } from 'src/app/service/airline.service';
import { FlightService } from 'src/app/service/flight.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css'],
})
export class AddFlightComponent implements OnInit {
  flightForm!: FormGroup;
  airlines: any[];

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
      fare: new FormControl('', [Validators.required]),
      airlineId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.airlineService.airlines$.subscribe((data) => {
      this.airlines = data;
    });

    this.airlineService.getAllAirlines();
  }

  onSubmit() {
    this.flightService.createFlight(this.flightForm.value).subscribe({
      next: () => {
        this.toastService.show('Flight added', true);

        this.flightForm.reset();
      },
      error: (err) => {
        this.toastService.show(err.error.message, false);
      },
    });
  }
}
