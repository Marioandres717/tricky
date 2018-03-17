import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() {
    const user = firebase.auth().currentUser;
    console.log(user);
    user !== null ? this.router.navigate(['/game']) : this.router.navigate(['/login']);
  }
}
