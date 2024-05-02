import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
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

  getAllAirlines() {
    return this.http.get(`${environment.apiUrl}/airlines`).pipe(
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

  updateAirline(requestBody: any, airlineId: number) {
    return this.http
      .put(`${environment.apiUrl}/airlines/${airlineId}`, requestBody)
      .pipe(
        catchError(this.errorHandler),
        tap((data) => {
          let airlines = this.airlinesSubject.getValue();

          airlines = airlines.map((airline: Airline) => {
            if (airline.airlineId === airlineId) {
              return data as Airline;
            }
            return airline;
          });

          this.airlinesSubject.next(airlines);
        })
      );
  }

  deleteAirline(airlineId: any) {
    return this.http.delete(`${environment.apiUrl}/airlines/${airlineId}`).pipe(
      catchError(this.errorHandler),
      tap(() => {
        let airlines = this.airlinesSubject.getValue();

        airlines = airlines.filter(
          (airline: Airline) => airline.airlineId !== airlineId
        );

        this.airlinesSubject.next(airlines);
      })
    );
  }

  addAirline(requestBody: any) {
    return this.http.post(`${environment.apiUrl}/airlines`, requestBody).pipe(
      catchError(this.errorHandler),
      tap((data) => {
        let airlines = this.airlinesSubject.getValue();

        airlines.push(data as Airline);

        this.airlinesSubject.next(airlines);
      })
    );
  }
}
