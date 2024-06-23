import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Passenger } from '../interface/passenger';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  constructor(private http: HttpClient) {}

  getAllPassengers(): Observable<Passenger[]> {
    return this.http
      .get<Passenger[]>(`${environment.apiUrl}/passengers`)
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

  deletePassenger(passengerId: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/passengers/${passengerId}`)
      .pipe(catchError(this.errorHandler));
  }
}
