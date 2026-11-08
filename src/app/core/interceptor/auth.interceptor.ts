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
import { JwtService } from '../service/jwt.service';
import { ToastService } from '../service/toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.jwtService.getToken(),
      },
    });

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.removeAuthenticatedUser();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
