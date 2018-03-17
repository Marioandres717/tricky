import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  onClose() {
    this.closeSidenav.emit();
  }

  logout() {
    this.auth.signOut();
  }
}
