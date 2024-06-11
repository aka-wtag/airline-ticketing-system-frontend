import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanLoad,
  Route,
  UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  private user!: User | null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.authenticatedUser.subscribe((response) => {
      this.user = response;
    });
  }
  private checkAuthentication(): boolean | UrlTree {
    if (this.user) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.checkAuthentication();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.checkAuthentication();
  }
}
