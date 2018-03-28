import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "../shared/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> {
    return new Promise ((resolve) => {
     this.auth.isLogged().subscribe(data => {
       if (!data) this.router.navigate(['/login']);
       resolve(!!data);
      });
    });
  }
}
