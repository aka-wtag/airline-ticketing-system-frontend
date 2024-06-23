import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Flight } from 'src/app/core/interface/flight';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.css'],
})
export class FlightDetailsComponent {
  @Input()
  selectedFlight!: Flight;

  @Output()
  closePopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  closeFlightDetails() {
    this.closePopup.emit(false);
  }
}
