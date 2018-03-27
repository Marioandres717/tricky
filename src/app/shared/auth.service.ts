import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import {UserService} from '../api/api.service';
import {UserProfile} from "../interfaces/user.model";
import {UiService} from './ui.service';


@Injectable()
export class AuthService {
  user: any;
  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor( private uiService: UiService, private userService: UserService, private router: Router ) {}

  public userInfo() {
    return firebase.auth().currentUser;
  }

  public createNewUser(userForm) {
    firebase.auth().createUserWithEmailAndPassword(userForm.value.email, userForm.value.password).then((user) => {
      let params: UserProfile = {
        user_uid: user.uid,
        user_email: userForm.value.email,
        user_nickname: userForm.value.username,
        user_total_wins: 0,
        user_total_games: 0
      };
      this.userService.createUserProfile(params)
        .subscribe(() => this.router.navigate(['/home']), err => console.log(`${err}: failed to create user Profile`));
    }, (err) => {
      console.log(`${err}: failed to create user`);
    });
  }

  public loginUser(email: string, password: string) {
    let self = this;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => self.router.navigate(['/home']), err => this.uiService.showSnackBar(err.message, null, 3000));
  }

  public googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
  }

  public getAuthState() {
    return this.isAuthenticated;
  }

  public signOut() {
    firebase.auth().signOut();
  }
}
