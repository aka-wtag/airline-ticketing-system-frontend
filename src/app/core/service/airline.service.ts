import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Airline } from '../interface/airline';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  private airlinesSubject: BehaviorSubject<Airline[]> = new BehaviorSubject<
    Airline[]
  >([]);
  public airlines$: Observable<Airline[]> = this.airlinesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllAirlines()  {
    return this.http
      .get(`${environment.apiUrl}/airlines`)
      .pipe(
        catchError(this.errorHandler),
        map((response) => {
          let airlines: Airline[] = [];
          for (let key in response) {
            if (response.hasOwnProperty(key)) {
              airlines.push((response as Record<string, Airline>)[key]);
            }
          }
          return airlines;
        }),
        tap((data) => {
          this.airlinesSubject.next(data);
        }),
        
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
}
