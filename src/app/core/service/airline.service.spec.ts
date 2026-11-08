import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AirlineService } from './airline.service';
import { environment } from 'src/environments/environment';
import { ERRORMESSAGE } from '../constants/error-message';
import { Airline } from '../interface/airline';
import { AirlineCreateRequest } from '../interface/airline-create-request';
import { AirlineUpdateRequest } from '../interface/airline-update-request';

describe('AirlineService', () => {
    let service: AirlineService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AirlineService],
        });
        service = TestBed.inject(AirlineService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch all airlines', () => {
        const dummyAirlines: Airline[] = [
            { airlineId: 1, airlineModel: 'BI-101', airlineName: 'Biman Bangladesh', numberOfSeats: 150 },
            { airlineId: 2, airlineModel: 'BI-102', airlineName: 'Biman Bangladesh', numberOfSeats: 180 },
        ];

        service.getAllAirlines().subscribe((airlines) => {
            expect(airlines).toEqual(dummyAirlines);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/airlines`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyAirlines);
    });

    it('should fetch airlines with pagination', () => {
        const page = 1;
        const size = 10;
        const dummyAirlines: Airline[] = [
            { airlineId: 1, airlineModel: 'model1', airlineName: 'name1', numberOfSeats: 150 },
        ];

        service.getAirlines(page, size).subscribe((airlines) => {
            expect(airlines).toEqual(dummyAirlines);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/airlines?page=${page}&size=${size}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyAirlines);
    });

    it('should add an airline', () => {
        const newAirline: AirlineCreateRequest = { airlineName: 'Biman Bangladesh', numberOfSeats: 200 };
        const createdAirline: Airline = { airlineId: 3, airlineModel: 'BI-103', airlineName: 'Biman Bangladesh', numberOfSeats: 200 };

        service.addAirline(newAirline).subscribe((airline) => {
            expect(airline).toEqual(createdAirline);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/airlines`);
        expect(req.request.method).toBe('POST');
        req.flush(createdAirline);
    });

    it('should update an airline', () => {
        const updatedAirline: AirlineUpdateRequest = { airlineModel: 'BI-103', airlineName: 'Updated Biman Bangladesh', numberOfSeats: 200 };
        const airlineId = 1;
        const returnedAirline: Airline = { airlineId: 1, airlineModel: 'BI-103', airlineName: 'Updated Biman Bangladesh', numberOfSeats: 200 };

        service.updateAirline(updatedAirline, airlineId).subscribe((airline) => {
            expect(airline).toEqual(returnedAirline);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/airlines/${airlineId}`);
        expect(req.request.method).toBe('PUT');
        req.flush(returnedAirline);
    });

    it('should delete an airline', () => {
        const airlineId = 1;

        service.deleteAirline(airlineId).subscribe((response) => {
            expect(response).toBeNull();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/airlines/${airlineId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    it('should handle 500 error', () => {
        service.getAllAirlines().subscribe(
            () => fail('should have failed with 500 error'),
            (error) => {
                expect(error).toEqual(ERRORMESSAGE.SERVICENOTAVAILABLE);
            }
        );

        const req = httpMock.expectOne(`${environment.apiUrl}/airlines`);
        req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });
});
