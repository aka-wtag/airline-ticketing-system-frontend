import { Injectable } from '@angular/core';
import { map, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../service/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  onLogin(data: any) {
    return this.http.post('http://localhost:8080/users/login', data).pipe(
      map((response) => {
        if (response) {
          this.tokenService.setToken(response['accessToken']);
        }
        return response;
      })
    );
  }

  onRegistration(data: any) {
    return this.http.post('http://localhost:8080/passengers', data);
  }

  onLogout() {
    this.http.post('http://localhost:8080/users/logout', null).subscribe(() => {
      this.tokenService.removeToken();
    });
  }
}
