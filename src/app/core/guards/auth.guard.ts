import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private user!: User | null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.authenticatedUser.subscribe((response) => {
      this.user = response;
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.user) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
