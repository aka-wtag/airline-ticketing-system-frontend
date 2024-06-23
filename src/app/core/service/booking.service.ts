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
import { Booking } from '../interface/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<Booking[]> {
    return this.http
      .get<Booking[]>(`${environment.apiUrl}/bookings`)
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Service not available';

    if (error.status >= 400 && error.status < 500) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = 'Request failed';
      }
    }

    return throwError(errorMessage);
  }

  deleteBooking(passengerId: number, bookingId: number): Observable<void> {
    return this.http
      .delete<void>(
        `${environment.apiUrl}/passengers/${passengerId}/bookings/${bookingId}`
      )
      .pipe(catchError(this.errorHandler));
  }

  createBooking(passengerId: number, requestBody: any) {
    return this.http
      .post(
        `${environment.apiUrl}/passengers/${passengerId}/bookings`,
        requestBody
      )
      .pipe(catchError(this.errorHandler));
  }
}
