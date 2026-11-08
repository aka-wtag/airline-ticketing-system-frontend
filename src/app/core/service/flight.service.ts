import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ERRORMESSAGE } from '../constants/error-message';
import { FlightSearchRequest } from '../interface/flight-search-request';
import { FlightUpdateRequest } from '../interface/flight-update-request';
import { Flight } from '../interface/flight';
import { FlightCreateRequest } from '../interface/flight-create-request';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  constructor(private http: HttpClient) { }

  getAllFlights() {
    return this.http
      .get(`${environment.apiUrl}/flights`)
      .pipe(catchError(this.errorHandler));
  }

  getFlights(page: number, size: number) {
    return this.http.get(
      `${environment.apiUrl}/flights?page=${page}&size=${size}`
    );
  }

  getSearchedFlights(params: FlightSearchRequest): Observable<Flight[]> {
    return this.http
      .get<Flight[]>(
        `${environment.apiUrl}/flights/searched-flights?departureDate=${params.departureDate}&departureLocation=${params.departureLocation}&arrivalLocation=${params.arrivalLocation}`
      )
      .pipe(catchError(this.errorHandler));
  }

  updateFlight(requestBody: FlightUpdateRequest, flightId: number): Observable<Flight> {
    return this.http
      .put<Flight>(`${environment.apiUrl}/flights/${flightId}`, requestBody)
      .pipe(catchError(this.errorHandler));
  }

  deleteflight(flightId: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/flights/${flightId}`)
      .pipe(catchError(this.errorHandler));
  }

  createFlight(requestBody: FlightCreateRequest): Observable<Flight> {
    return this.http
      .post<Flight>(`${environment.apiUrl}/flights`, requestBody)
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
