import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../interface/user';
import { JwtService } from './jwt.service';
import { ROUTES } from '../constants/routes';
import { ERRORMESSAGE } from '../constants/error-message';
import { Token } from '../interface/token';
import { Login } from '../interface/login';
import { PassengerCreateRequest } from '../interface/passenger-create-request';
import { Passenger } from '../interface/passenger';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticatedUser: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) {
    if (this.jwtService.getToken()) {
      this.updateAuthenticatedUser(
        this.jwtService.getUserFromToken(this.jwtService.getToken())
      );
    }
  }

  onLogin(data: Login): Observable<Token> {
    return this.http
      .post<Token>(`${environment.apiUrl}/users/login`, data)
      .pipe(catchError(this.errorHandler));
  }

  onRegistration(data: PassengerCreateRequest): Observable<Passenger> {
    return this.http
      .post<Passenger>(`${environment.apiUrl}/passengers`, data)
      .pipe(catchError(this.errorHandler));
  }

  onLogout(): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/users/logout`, null)
      .pipe(catchError(this.errorHandler));
  }

  updateAuthenticatedUser(user: User | null): void {
    this.authenticatedUser.next(user);
  }

  setAuthenticatedUser(response: Token): void {
    this.updateAuthenticatedUser(
      this.jwtService.getUserFromToken(response.accessToken)
    );
    this.jwtService.setToken(response.accessToken);
  }

  removeAuthenticatedUser(): void {
    this.updateAuthenticatedUser(null);
    this.jwtService.removeToken();

    this.router.navigate([ROUTES.LOGIN]);
  }

  getUserId(): number | undefined {
    return this.authenticatedUser?.getValue()?.id;
  }

  getUserType(): string | undefined {
    return this.authenticatedUser?.getValue()?.role;
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
