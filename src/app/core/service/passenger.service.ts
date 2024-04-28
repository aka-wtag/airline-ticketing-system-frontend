import { Injectable, OnInit } from '@angular/core';
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
import { Passenger } from '../interface/passenger';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  private passengersSubject: BehaviorSubject<Passenger[]> = new BehaviorSubject<
    Passenger[]
  >([]);
  public passengers$: Observable<Passenger[]> =
    this.passengersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPassengers() {
    return this.http.get(`${environment.apiUrl}/passengers`).pipe(
      catchError(this.errorHandler),
      map((response) => {
        let passengers: Passenger[] = [];
        for (let key in response) {
          if (response.hasOwnProperty(key)) {
            passengers.push((response as Record<string, Passenger>)[key]);
          }
        }
        return passengers;
      }),
      tap((data) => {
        this.passengersSubject.next(data);
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
}
