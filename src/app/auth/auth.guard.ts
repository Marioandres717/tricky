import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate, Route} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class  AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const isLoggedIn = this.authService.getAuth()
      console.log('canActivate', isLoggedIn);
        return isLoggedIn;
  }
}
