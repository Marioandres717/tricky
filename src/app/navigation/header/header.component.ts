import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth: boolean;
  isAuthSubscription: Subscription;
  @Output() sidenavToggle = new EventEmitter<void>();
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.isAuthSubscription = this.auth.authChange.subscribe(authStatus => this.isAuth = authStatus);
  }

  ngOnDestroy() {
    this.isAuthSubscription.unsubscribe();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/']);
  }

}
