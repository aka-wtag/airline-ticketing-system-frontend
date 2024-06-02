import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Airline } from '../interface/airline';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  constructor(private http: HttpClient) {}

  getAllAirlines(): Observable<Airline[]> {
    return this.http
      .get<Airline[]>(`${environment.apiUrl}/airlines`)
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
}
