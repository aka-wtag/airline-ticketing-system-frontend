export interface FlightCreateRequest {
    arrivalDate: string;
    arrivalLocation: string;
    arrivalTime: string;
    departureDate: string;
    departureLocation: string;
    departureTime: string;
    fare: number;
    airlineId: number
}