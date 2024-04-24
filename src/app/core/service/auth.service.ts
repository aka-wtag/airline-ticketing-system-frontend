import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../interface/user';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticatedUser: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtService: JwtService
  ) {
    if (this.jwtService.getToken()) {
      this.updateAuthenticatedUser(
        this.jwtService.getUserFromToken(this.jwtService.getToken())
      );
    }
  }

  onLogin(data: any) {
    return this.http.post(`${environment.apiUrl}/users/login`, data).pipe(
      map((response) => {
        if (response) {
          this.setAuthenticatedUser(response);
        }
        return response;
      })
    );
  }

  onRegistration(data: any) {
    return this.http.post(`${environment.apiUrl}/passengers`, data);
  }

  onLogout() {
    this.http.post(`${environment.apiUrl}/users/logout`, null).subscribe(() => {
      this.removeAuthenticatedUser();
      this.router.navigate(['/login']);
    });
  }

  updateAuthenticatedUser(user: User | null) {
    this.authenticatedUser.next(user);
  }

  setAuthenticatedUser(response: any) {
    this.updateAuthenticatedUser(
      this.jwtService.getUserFromToken(response['accessToken'])
    );
    this.jwtService.setToken(response['accessToken']);
  }

  removeAuthenticatedUser() {
    this.updateAuthenticatedUser(null);
    this.jwtService.removeToken();
  }

  getUserId(): number | undefined {
    return this.authenticatedUser?.getValue()?.id;
  }

  getUserType(): string | undefined {
    return this.authenticatedUser?.getValue()?.role;
  }
}
