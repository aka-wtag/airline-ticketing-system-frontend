import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ERRORMESSAGE } from '../constants/error-message';
import { AirlineUpdateRequest } from '../interface/airline-update-request';
import { Airline } from '../interface/airline';
import { AirlineCreateRequest } from '../interface/airline-create-request';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  constructor(private http: HttpClient) { }

  getAllAirlines() {
    return this.http
      .get(`${environment.apiUrl}/airlines`)
      .pipe(catchError(this.errorHandler));
  }

  getAirlines(page: number, size: number) {
    return this.http.get(`${environment.apiUrl}/airlines?page=${page}&size=${size}`);
  }

  updateAirline(requestBody: AirlineUpdateRequest, airlineId: number): Observable<Airline> {
    return this.http
      .put<Airline>(`${environment.apiUrl}/airlines/${airlineId}`, requestBody)
      .pipe(catchError(this.errorHandler));
  }

  deleteAirline(airlineId: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.apiUrl}/airlines/${airlineId}`)
      .pipe(catchError(this.errorHandler));
  }

  addAirline(requestBody: AirlineCreateRequest): Observable<Airline> {
    return this.http
      .post<Airline>(`${environment.apiUrl}/airlines`, requestBody)
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
