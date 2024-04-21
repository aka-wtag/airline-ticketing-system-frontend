import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    null
  );
  public flights$: Observable<any[]> = this.bookingsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllBookings(): void {
    if (!this.bookingsSubject.value) {
      this.http
        .get(`${environment.apiUrl}/bookings`)
        .pipe(
          map((response) => {
            let bookings = [];
            for (let key in response) {
              if (response.hasOwnProperty(key)) {
                bookings.push(response[key]);
              }
            }
            return bookings;
          }),
          tap((data) => {
            this.bookingsSubject.next(data);
          })
        )
        .subscribe();
    }
  }
}
