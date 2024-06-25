import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FlightService } from './flight.service';
import { environment } from 'src/environments/environment';
import { Flight } from '../interface/flight';
import { FlightSearchRequest } from '../interface/flight-search-request';
import { FlightUpdateRequest } from '../interface/flight-update-request';
import { FlightCreateRequest } from '../interface/flight-create-request';
import { ERRORMESSAGE } from '../constants/error-message';

describe('FlightService', () => {
  let service: FlightService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FlightService],
    });

    service = TestBed.inject(FlightService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all flights', () => {
    const mockFlights: Flight[] = [
      {
        flightId: 1,
        fare: 1000,
        remainingSeats: 50,
        departureDate: '2023-07-01',
        departureLocation: 'Dhaka',
        departureTime: '08:00',
        arrivalDate: '2023-07-01',
        arrivalLocation: 'LA',
        arrivalTime: '11:00',
        airline: {
          airlineId: 1,
          airlineModel: 'Model 1',
          airlineName: 'Airline 1',
          numberOfSeats: 100,
        },
      },
    ];

    service.getAllFlights().subscribe((flights) => {
      expect(flights).toEqual(mockFlights);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flights`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFlights);
  });

  it('should fetch flights with pagination', () => {
    const mockFlights: Flight[] = [
      {
        flightId: 1,
        fare: 1000,
        remainingSeats: 50,
        departureDate: '2023-07-01',
        departureLocation: 'Dhaka',
        departureTime: '08:00',
        arrivalDate: '2023-07-01',
        arrivalLocation: 'LA',
        arrivalTime: '11:00',
        airline: {
          airlineId: 1,
          airlineModel: 'Model 1',
          airlineName: 'Airline 1',
          numberOfSeats: 100,
        },
      },
    ];

    service.getFlights(1, 10).subscribe((flights) => {
      expect(flights).toEqual(mockFlights);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/flights?page=1&size=10`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockFlights);
  });

  it('should search for flights', () => {
    const mockFlights: Flight[] = [
      {
        flightId: 1,
        fare: 1000,
        remainingSeats: 50,
        departureDate: '2023-07-01',
        departureLocation: 'NYC',
        departureTime: '08:00',
        arrivalDate: '2023-07-01',
        arrivalLocation: 'LA',
        arrivalTime: '11:00',
        airline: {
          airlineId: 1,
          airlineModel: 'Model 1',
          airlineName: 'Airline 1',
          numberOfSeats: 100,
        },
      },
    ];
    const searchParams: FlightSearchRequest = {
      departureDate: '2023-07-01',
      departureLocation: 'NYC',
      arrivalLocation: 'LA',
    };

    service.getSearchedFlights(searchParams).subscribe((flights) => {
      expect(flights).toEqual(mockFlights);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/flights/searched-flights?departureDate=2023-07-01&departureLocation=NYC&arrivalLocation=LA`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockFlights);
  });

  it('should update a flight', () => {
    const mockFlight: Flight = {
      flightId: 1,
      fare: 1500,
      remainingSeats: 50,
      departureDate: '2023-07-01',
      departureLocation: 'NYC',
      departureTime: '08:00',
      arrivalDate: '2023-07-01',
      arrivalLocation: 'LA',
      arrivalTime: '11:00',
      airline: {
        airlineId: 1,
        airlineModel: 'Model 1',
        airlineName: 'Airline 1',
        numberOfSeats: 100,
      },
    };
    const updateRequest: FlightUpdateRequest = { fare: 1500, airlineId: 1 };

    service.updateFlight(updateRequest, 1).subscribe((flight) => {
      expect(flight).toEqual(mockFlight);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flights/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockFlight);
  });

  it('should delete a flight', () => {
    service.deleteflight(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flights/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should create a flight', () => {
    const mockFlight: Flight = {
      flightId: 1,
      fare: 1000,
      remainingSeats: 50,
      departureDate: '2023-07-01',
      departureLocation: 'NYC',
      departureTime: '08:00',
      arrivalDate: '2023-07-01',
      arrivalLocation: 'LA',
      arrivalTime: '11:00',
      airline: {
        airlineId: 1,
        airlineModel: 'Model 1',
        airlineName: 'Airline 1',
        numberOfSeats: 100,
      },
    };
    const createRequest: FlightCreateRequest = {
      fare: 1000,
      departureDate: '2023-07-01',
      departureLocation: 'NYC',
      departureTime: '08:00',
      arrivalDate: '2023-07-01',
      arrivalLocation: 'LA',
      arrivalTime: '11:00',
      airlineId: 1,
    };

    service.createFlight(createRequest).subscribe((flight) => {
      expect(flight).toEqual(mockFlight);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flights`);
    expect(req.request.method).toBe('POST');
    req.flush(mockFlight);
  });

  it('should handle errors', () => {
    service.getAllFlights().subscribe({
      error: (error) => {
        expect(error).toBe(ERRORMESSAGE.SERVICENOTAVAILABLE);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flights`);
    req.flush(null, { status: 500, statusText: 'Server Error' });
  });
});
