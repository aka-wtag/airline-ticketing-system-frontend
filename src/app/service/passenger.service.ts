import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  private passengersSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >(null);
  public passengers$: Observable<any[]> = this.passengersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPassengers(): void {
    if (!this.passengersSubject.value) {
      this.http
        .get(`${environment.apiUrl}/passengers`)
        .pipe(
          map((response) => {
            let passengers = [];
            for (let key in response) {
              if (response.hasOwnProperty(key)) {
                passengers.push(response[key]);
              }
            }
            return passengers;
          }),
          tap((data) => {
            this.passengersSubject.next(data);
          }),
          catchError((error) => {
            return throwError(error);
          })
        )
        .subscribe();
    }
  }
}
