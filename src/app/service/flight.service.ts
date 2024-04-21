import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flightsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    null
  );
  public flights$: Observable<any[]> = this.flightsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllFlights(): void {
    if (!this.flightsSubject.value) {
      this.http
        .get(`${environment.apiUrl}/flights`)
        .pipe(
          map((response) => {
            let flights = [];
            for (let key in response) {
              if (response.hasOwnProperty(key)) {
                flights.push(response[key]);
              }
            }
            return flights;
          }),
          tap((data) => {
            this.flightsSubject.next(data);
          })
        )
        .subscribe();
    }
  }

  updateFlight(requestBody: any, flightId: any) {
    return this.http
      .put(`${environment.apiUrl}/flights/${flightId}`, requestBody)
      .pipe(
        tap((data) => {
          let flights = this.flightsSubject.getValue();

          flights = flights.map((flight) => {
            if (flight['flightId'] == flightId) {
              return data;
            }
            return flight;
          });

          this.flightsSubject.next(flights);
        })
      );
  }

  deleteflight(flightId: number) {
    return this.http.delete(`${environment.apiUrl}/flights/${flightId}`).pipe(
      tap(() => {
        let flights = this.flightsSubject.getValue();

        flights = flights.filter((flight) => {
          if (flight['flightId'] !== flightId) {
            return flight;
          }
        });

        this.flightsSubject.next(flights);
      })
    );
  }
}
