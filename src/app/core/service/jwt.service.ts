import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor() {}

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserFromToken(token: string | null): User | null {
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken
        ? { id: decodedToken.sub, role: decodedToken.userType }
        : null;
    }

    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }
}
