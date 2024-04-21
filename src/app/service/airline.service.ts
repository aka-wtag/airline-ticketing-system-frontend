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
export class AirlineService {
  private airlinesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    null
  );
  public airlines$: Observable<any[]> = this.airlinesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllAirlines(): void {
    if (!this.airlinesSubject.value) {
      this.http
        .get(`${environment.apiUrl}/airlines`)
        .pipe(
          map((response) => {
            let airlines = [];
            for (let key in response) {
              if (response.hasOwnProperty(key)) {
                airlines.push(response[key]);
              }
            }
            return airlines;
          }),
          tap((data) => {
            this.airlinesSubject.next(data);
          }),
          catchError((error) => {
            console.error('Error fetching airlines:', error);
            return throwError(error);
          })
        )
        .subscribe();
    }
  }
}
