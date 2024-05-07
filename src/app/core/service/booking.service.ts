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
  private bookingsSubject: BehaviorSubject<Booking[]> = new BehaviorSubject<
    Booking[]
  >([]);
  public flights$: Observable<Booking[]> = this.bookingsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllBookings() {
    return this.http.get(`${environment.apiUrl}/bookings`).pipe(
      catchError(this.errorHandler),
      map((response) => {
        let bookings: Booking[] = [];
        for (let key in response) {
          if (response.hasOwnProperty(key)) {
            bookings.push((response as Record<string, Booking>)[key]);
          }
        }
        return bookings;
      }),
      tap((data) => {
        this.bookingsSubject.next(data);
      })
    );
  }

  private errorHandler(error: HttpErrorResponse) {
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

  deleteBooking(passengerId: number, bookingId: number) {
    return this.http
      .delete(
        `${environment.apiUrl}/passengers/${passengerId}/bookings/${bookingId}`
      )
      .pipe(
        catchError(this.errorHandler),
        tap(() => {
          let bookings: Booking[] = this.bookingsSubject.getValue();

          bookings = bookings.filter(
            (booking: Booking) => booking.bookingNumber !== bookingId
          );

          this.bookingsSubject.next(bookings);
        })
      );
  }

  createBooking(passengerId: number, requestBody: any) {
    return this.http
      .post(
        `${environment.apiUrl}/passengers/${passengerId}/bookings`,
        requestBody
      )
      .pipe(
        catchError(this.errorHandler),
        tap((data) => {
          let bookings: Booking[] = this.bookingsSubject.getValue();

          bookings.unshift(data as Booking);

          this.bookingsSubject.next(bookings);
        })
      );
  }
}
