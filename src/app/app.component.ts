import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {AuthService} from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  isAuth: boolean;
  isAuthSubscription: Subscription;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
   this.isAuthSubscription = this.auth.authChange.subscribe(authStatus => this.isAuth = authStatus);
   console.log('esto no esta ejecutando?', this.isAuth);
  }
  ngOnDestroy() {
    this.isAuthSubscription.unsubscribe();
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/']);
  }
}
