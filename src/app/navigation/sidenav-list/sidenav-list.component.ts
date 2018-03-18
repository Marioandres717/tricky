import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth: boolean;
  isAuthSubscription: Subscription;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.isAuthSubscription = this.auth.authChange.subscribe(authStatus => this.isAuth = authStatus);
  }

  ngOnDestroy() {
    this.isAuthSubscription.unsubscribe();
  }

  onClose() {
    this.closeSidenav.emit();
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/']);
  }
}
