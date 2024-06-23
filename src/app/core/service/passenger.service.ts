import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ERRORMESSAGE } from '../constants/error-message';
import { Passenger } from '../interface/passenger';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  constructor(private http: HttpClient) { }

  getAllPassengers() {
    return this.http
      .get(`${environment.apiUrl}/passengers`)
      .pipe(catchError(this.errorHandler));
  }

  getPassengers(page: number, size: number) {
    return this.http.get(
      `${environment.apiUrl}/passengers?page=${page}&size=${size}`
    );
  }

  deletePassenger(passengerId: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/passengers/${passengerId}`)
      .pipe(catchError(this.errorHandler));
  }

  getPassengerDetails(passengerId: number): Observable<Passenger> {
    return this.http
      .get<Passenger>(`${environment.apiUrl}/passengers/${passengerId}`)
      .pipe(catchError(this.errorHandler));
  }

  updatePassengerDetails(userDetails: any, passengerId: number): Observable<Passenger> {
    return this.http
      .put<Passenger>(`${environment.apiUrl}/passengers/${passengerId}`, userDetails)
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
