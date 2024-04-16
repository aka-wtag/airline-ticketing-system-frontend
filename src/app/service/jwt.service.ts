import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

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

  getUserIdFromToken(token: string): string {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken.userId : null;
  }

  getUserTypeFromToken(token: string): string {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken.userType : null;
  }
}
