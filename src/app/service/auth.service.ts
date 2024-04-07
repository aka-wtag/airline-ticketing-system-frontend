import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private http: HttpClient) {
    if (this.getToken() && this.getId() && this.getType()) {
      this.updateAuth(true);
    }
  }

  onLogin(data: any) {
    return this.http.post(`${environment.apiUrl}/users/login`, data).pipe(
      map((response) => {
        if (response) {
          this.setAuth(response);
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
      this.removeAuth();
    });
  }

  updateAuth(status: boolean) {
    this.isAuthenticated.next(status);
  }

  setAuth(response: any) {
    this.updateAuth(true);
    localStorage.setItem('token', response['accessToken']);
    localStorage.setItem('UI', response['id']);
    localStorage.setItem('UT', response['userType']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getId(): string | null {
    return localStorage.getItem('UI');
  }

  getType(): string | null {
    return localStorage.getItem('UT');
  }

  removeAuth() {
    this.updateAuth(false);
    localStorage.removeItem('token');
    localStorage.removeItem('UI');
    localStorage.removeItem('UT');
  }
}
