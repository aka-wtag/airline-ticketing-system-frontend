import { Airline } from "./airline";

export interface Flight {
  arrivalDate: string;
  arrivalLocation: string;
  arrivalTime: string;
  departureDate: string;
  departureLocation: string;
  departureTime: string;
  fare: number;
  flightId: number;
  remainingSeats: number;
  airline: Airline
}
