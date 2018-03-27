import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

@Injectable()
export class AuthGuard implements CanActivate {
  onAuthStateChanged = Observable.create(obs => firebase.auth().onAuthStateChanged(obs));
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.onAuthStateChanged
      .do(user => {if(!user) { this.router.navigate['/login'] }})
      .map(user => !!user)
  }
}
