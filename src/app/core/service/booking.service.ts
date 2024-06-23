import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { ERRORMESSAGE } from '../constants/error-message';
import { BookingCreateRequest } from '../interface/booking-create-request';
import { Booking } from '../interface/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) { }

  getBookings(page: number, size: number) {
    return this.http.get(
      `${environment.apiUrl}/bookings?page=${page}&size=${size}`
    );
  }

  getPassengerBookings(passengerId: number) {
    return this.http
      .get(`${environment.apiUrl}/passengers/${passengerId}/bookings`)
      .pipe(catchError(this.errorHandler));
  }

  deleteBooking(passengerId: number, bookingId: number): Observable<void> {
    return this.http
      .delete<void>(
        `${environment.apiUrl}/passengers/${passengerId}/bookings/${bookingId}`
      )
      .pipe(catchError(this.errorHandler));
  }

  createBooking(passengerId: number, requestBody: BookingCreateRequest): Observable<Booking> {
    return this.http
      .post<Booking>(
        `${environment.apiUrl}/passengers/${passengerId}/bookings`,
        requestBody
      )
      .pipe(catchError(this.errorHandler));
  }


  private errorHandler(error: HttpErrorResponse): Observable<never> {
    let errorMessage = ERRORMESSAGE.SERVICENOTAVAILABLE;

    if (error.status >= 400 && error.status < 500) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = ERRORMESSAGE.REQUESTFAILED;
      }
    }

    return throwError(errorMessage);
  }
}
