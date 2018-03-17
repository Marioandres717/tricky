import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.auth.signOut();
  }

}
