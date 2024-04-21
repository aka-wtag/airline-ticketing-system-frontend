import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Auth Interceptor called!');

    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.removeAuth();
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
