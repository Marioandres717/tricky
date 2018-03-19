import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../shared/auth.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import "rxjs/add/operator/map";

@Injectable()
export class  AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.afAuth.authState.map((auth) => {
      if (auth == null) {
        this.router.navigate(['/']);
        return false;
      } else {
        return true;
      }
    });
  }

}
