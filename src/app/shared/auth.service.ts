import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';


interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  dateOfBirth?: Date;
  Win?: number;
  TotalGames?: number;
}

@Injectable()
export class AuthService {
  user: any;
  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
      } else {
        this.isAuthenticated = false;
        this.authChange.next(false);
      }
    });
  }

  public userInfo() {
    return this.user = firebase.auth().currentUser;
  }

  public createNewUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((data) => {
        this.userInfo();
        this.updateUserData(this.user);
        resolve(data);
      }, (err) => {
        reject(err);
      });
    });
  }

  public loginUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then((data) => {
        resolve(data);
      }, (err) => {
        reject(err);
      });
    });
  }

  public googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
    };
     this.router.navigate(['/home']);
      // Stores in the db
      return userRef.set(Object.assign({}, data), {merge: true});
  }

  public getAuthState() {
    return this.isAuthenticated;
  }

  signOut() {
    this.afAuth.auth.signOut();
  }
}
