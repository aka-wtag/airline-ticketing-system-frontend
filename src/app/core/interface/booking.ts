import { Flight } from './flight';
import { Passenger } from './passenger';

export interface Booking {
  bookingNumber: number;
  bookingDate: string;
  bookedSeats: number;
  bookingAmount: number;
  passenger: Passenger;
  flight: Flight;
}
