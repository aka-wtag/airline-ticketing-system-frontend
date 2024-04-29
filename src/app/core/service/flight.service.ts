import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Flight } from '../interface/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private flightsSubject: BehaviorSubject<Flight[]> = new BehaviorSubject<
    Flight[]
  >([]);
  public flights$: Observable<Flight[]> = this.flightsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllFlights() {
    return this.http.get(`${environment.apiUrl}/flights`).pipe(
      catchError(this.errorHandler),
      map((response) => {
        let flights: Flight[] = [];
        for (let key in response) {
          if (response.hasOwnProperty(key)) {
            flights.push((response as Record<string, Flight>)[key]);
          }
        }
        return flights;
      }),
      tap((data) => {
        this.flightsSubject.next(data);
      })
    );
  }

  updateFlight(requestBody: any, flightId: any) {
    return this.http
      .put(`${environment.apiUrl}/flights/${flightId}`, requestBody)
      .pipe(
        catchError(this.errorHandler),
        tap((data) => {
          let flights: Flight[] = this.flightsSubject.getValue();

          flights = flights.map((flight: Flight) => {
            if (flight['flightId'] == flightId) {
              return data as Flight;
            }
            return flight;
          });

          this.flightsSubject.next(flights);
        })
      );
  }

  deleteflight(flightId: number) {
    return this.http.delete(`${environment.apiUrl}/flights/${flightId}`).pipe(
      catchError(this.errorHandler),
      tap(() => {
        let flights: Flight[] = this.flightsSubject.getValue();

        flights = flights.filter((flight: Flight) => {
          if (flight.flightId === flightId) {
            return false;
          }
          return true;
        });

        this.flightsSubject.next(flights);
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

  createFlight(requestBody: any) {
    return this.http.post(`${environment.apiUrl}/flights`, requestBody).pipe(
      catchError(this.errorHandler),
      // tap((data) => {
      //   let flights = this.flightsSubject.getValue();

      //   if (flights) {
      //     flights.unshift(data);

      //     this.flightsSubject.next(flights);
      //   }
      // })
    );
  }
}
