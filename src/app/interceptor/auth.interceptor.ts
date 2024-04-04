import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEventType,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { TokenService } from '../service/token.service';

export class AuthInterceptor implements HttpInterceptor {
  tokenService: TokenService = new TokenService();

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Auth Interceptor called!');
    const modifiedReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + this.tokenService.getToken()
      ),
    });
    return next.handle(modifiedReq);
  }
}
