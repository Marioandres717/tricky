import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router) {

    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('user is logged in');
        this.router.navigate(['/game']);
      } else {
        this.router.navigate(['/login']);
        console.log('user not logged in');
      }
    });
  }
  ngOnInit() {}
}
