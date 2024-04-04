import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  constructor(private http: HttpClient) {}

  getAllAirlines() {
    return this.http.get('http://localhost:8080/airlines');
  }
}
