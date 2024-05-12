import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  createFlight(requestBody: any) {
    return this.http.post(`${environment.apiUrl}/flights`, requestBody).pipe(
      catchError(this.errorHandler),
    );
  }
}
