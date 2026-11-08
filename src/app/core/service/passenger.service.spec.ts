import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PassengerService } from './passenger.service';
import { environment } from 'src/environments/environment';
import { ERRORMESSAGE } from '../constants/error-message';
import { Passenger } from '../interface/passenger';
import { HttpErrorResponse } from '@angular/common/http';

describe('PassengerService', () => {
  let service: PassengerService;
  let httpTestingController: HttpTestingController;

  const mockPassengers: Passenger[] = [
    {
      userId: 1,
      userFullName: 'user1',
      userEmail: 'user1@gmail.com',
      userContact: '1234567890',
      passengerPassport: 'AB123456',
    },
    {
      userId: 2,
      userFullName: 'user2',
      userEmail: 'user2@gmail.com',
      userContact: '9876543210',
      passengerPassport: 'CD789012',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PassengerService],
    });
    service = TestBed.inject(PassengerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all passengers successfully', () => {
    service.getAllPassengers().subscribe(
      (passengers) => {
        expect(passengers).toEqual(mockPassengers);
      },
      (error) => {
        fail('Expected successful response, not an error');
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockPassengers);
  });

  it('should handle error when retrieving all passengers', () => {
    service.getAllPassengers().subscribe(
      () => fail('Expected an error, not passengers'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error).toBe(ERRORMESSAGE.REQUESTFAILED);
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers`
    );
    expect(req.request.method).toEqual('GET');
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('should get paginated passengers successfully', () => {
    const page = 1;
    const size = 10;
    const mockPaginatedResponse = {
      content: mockPassengers,
      totalElements: 2,
    };

    service.getPassengers(page, size).subscribe(
      (response: any) => {
        expect(response.content).toEqual(mockPaginatedResponse.content);
        expect(response.totalElements).toBe(2);
      },
      (error: any) => {
        fail('Expected successful response, not an error: ' + error.message);
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers?page=${page}&size=${size}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockPaginatedResponse);
  });

  it('should handle error when retrieving paginated passengers', () => {
    const page = 1;
    const size = 10;

    service.getPassengers(page, size).subscribe(
      () => {
        fail('Expected error response, not success');
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
        expect(error.message).toContain('Http failure response');
        expect(error.error).toEqual({});
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers?page=${page}&size=${size}`
    );
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should delete passenger successfully', () => {
    const passengerId = 1;

    service.deletePassenger(passengerId).subscribe(
      (response) => {
        expect(response).toBeNull();
      },
      (error) => {
        fail('Expected successful deletion, not an error');
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers/${passengerId}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('should handle error when deleting a passenger', () => {
    const passengerId = 1;

    service.deletePassenger(passengerId).subscribe(
      () => fail('Expected an error, not success'),
      (error: any) => {
        expect(error).toBeTruthy();
        expect(error).toBe(ERRORMESSAGE.REQUESTFAILED);
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers/${passengerId}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });

  it('should get passenger details successfully', () => {
    const passengerId = 1;
    const mockPassenger: Passenger = {
      userId: 1,
      userFullName: 'user1',
      userEmail: 'user1@gmail.com',
      userContact: '1234567890',
      passengerPassport: 'AB123456',
    };

    service.getPassengerDetails(passengerId).subscribe(
      (response) => {
        expect(response).toEqual(mockPassenger);
      },
      (error) => {
        fail('Expected successful response, not an error');
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers/${passengerId}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockPassenger);
  });

  it('should handle error when retrieving passenger details', () => {
    const passengerId = 1;

    service.getPassengerDetails(passengerId).subscribe(
      () => fail('Expected an error, not passenger details'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error).toBe(ERRORMESSAGE.SERVICENOTAVAILABLE);
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers/${passengerId}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should update passenger details successfully', () => {
    const passengerId = 1;
    const updatedDetails = { userFullName: 'Updated Name' };

    service.updatePassengerDetails(updatedDetails, passengerId).subscribe(
      (response) => {
        expect(response.userFullName).toBe('Updated Name');
      },
      (error) => {
        fail('Expected successful update, not an error');
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers/${passengerId}`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush({ ...updatedDetails, userId: passengerId });
  });

  it('should handle error when updating passenger details', () => {
    const passengerId = 1;
    const updatedDetails = { userFullName: 'Updated Name' };

    service.updatePassengerDetails(updatedDetails, passengerId).subscribe(
      () => fail('Expected an error, not success'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error).toBe(ERRORMESSAGE.SERVICENOTAVAILABLE);
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/passengers/${passengerId}`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush({}, { status: 500, statusText: 'Service Unavailable' });
  });
});
