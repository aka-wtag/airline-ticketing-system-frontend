import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FlightCreateDTo } from '../interface/flightCreateDto';
import { Flight } from '../interface/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  constructor(private http: HttpClient) {}

  getAllFlights() {
    return this.http
      .get(`${environment.apiUrl}/flights`)
      .pipe(catchError(this.errorHandler));
  }

  updateFlight(requestBody: any, flightId: any) {
    return this.http
      .put(`${environment.apiUrl}/flights/${flightId}`, requestBody)
      .pipe(catchError(this.errorHandler));
  }

  deleteflight(flightId: number) {
    return this.http
      .delete(`${environment.apiUrl}/flights/${flightId}`)
      .pipe(catchError(this.errorHandler));
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

  createFlight(requestBody: FlightCreateDTo): Observable<Flight> {
    return this.http
      .post<Flight>(`${environment.apiUrl}/flights`, requestBody)
      .pipe(catchError(this.errorHandler));
  }
}
