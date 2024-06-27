import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { environment } from 'src/environments/environment';
import { Booking } from '../interface/booking';
import { ERRORMESSAGE } from '../constants/error-message';
import { BookingCreateRequest } from '../interface/booking-create-request';

describe('BookingService', () => {
    let service: BookingService;
    let httpTestingController: HttpTestingController;

    const mockBookings: Booking[] = [
        {
            bookingNumber: 1,
            bookingDate: '2024-06-27',
            bookedSeats: 2,
            bookingAmount: 200,
            passenger: {
                userId: 1,
                userFullName: 'user1',
                userEmail: 'user1@gmail.com',
                userContact: '1234567890',
                passengerPassport: 'ABCD1234'
            },
            flight: {
                arrivalDate: '2024-06-27',
                arrivalLocation: 'y',
                arrivalTime: '12:00 PM',
                departureDate: '2024-06-27',
                departureLocation: 'x',
                departureTime: '10:00 AM',
                fare: 100,
                flightId: 1,
                remainingSeats: 150,
                airline: {
                    airlineId: 1,
                    airlineModel: 'BI-101',
                    airlineName: 'Biman Bangladesh',
                    numberOfSeats: 200
                }
            }
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BookingService]
        });
        service = TestBed.inject(BookingService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should retrieve bookings from API via GET', () => {
        const page = 1;
        const size = 10;

        service.getBookings(page, size).subscribe(bookings => {
            expect(bookings).toEqual(mockBookings);
        });

        const req = httpTestingController.expectOne(`${environment.apiUrl}/bookings?page=${page}&size=${size}`);
        expect(req.request.method).toEqual('GET');
        req.flush(mockBookings);
    });

    it('should handle error when retrieving passenger bookings', () => {
        const passengerId = 1;

        service.getPassengerBookings(passengerId).subscribe(
            () => fail('expected an error, not bookings'),
            error => {
                expect(error).toBeTruthy();
                expect(error).toBe(ERRORMESSAGE.REQUESTFAILED);
            }
        );

        const req = httpTestingController.expectOne(`${environment.apiUrl}/passengers/${passengerId}/bookings`);
        expect(req.request.method).toEqual('GET');
        req.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('should delete booking via DELETE method', () => {
        const passengerId = 1;
        const bookingId = 1;

        service.deleteBooking(passengerId, bookingId).subscribe(
            () => {
                expect().nothing();
            },
            error => fail('deleteBooking request should have succeeded')
        );

        const req = httpTestingController.expectOne(`${environment.apiUrl}/passengers/${passengerId}/bookings/${bookingId}`);
        expect(req.request.method).toEqual('DELETE');
        req.flush({});
    });

    it('should create booking via POST method', () => {
        const passengerId = 1;
        const request: BookingCreateRequest = {
            bookedSeats: 2,
            flightId: 1
        };

        service.createBooking(passengerId, request).subscribe(booking => {
            expect(booking).toEqual(mockBookings[0]);
        });

        const req = httpTestingController.expectOne(`${environment.apiUrl}/passengers/${passengerId}/bookings`);
        expect(req.request.method).toEqual('POST');
        req.flush(mockBookings[0]);
    });
});
