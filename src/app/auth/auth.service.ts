import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  DateOfBirth?: Date;
}

@Injectable()
export class AuthService {
  user: Observable<User>;
  isAuthenticated: boolean;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {

    /// Get auth data, then get Firestore user document || null
    // We want to define the user observable so any part of the app can subscribe to it and receive updates on real-time
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
  }

  public createNewUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data) {
        resolve(data);
      }, function(err) {
        reject(err);
      });
    });
  }

  checkForAuth() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        console.log('the user is logged in!' + user.email);
        this.router.navigate(['/game']);  
      } else {
        this.isAuthenticated = false;
        this.router.navigate(['/']);
      }
    })
  }

  getAuth() {
    return this.isAuthenticated;
  }

  // googleLogin() {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // private oAuthLogin(provider) {
  //   return this.afAuth.auth.signInWithPopup(provider)
  //     .then((credential) => {
  //       this.updateUserData(credential.user);
  //     });
  // }

 //  private updateUserData(user) {
 //    // Sets user data to firestore on login
 //  const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
 //
 //  const data: User = {
 //    uid: user.uid,
 //    email: user.email,
 //    displayName: user.displayName,
 //    photoURL: user.photoURL
 //  };
 //  // Stores in the db
 //  return userRef.set(Object.assign({}, data), {merge: true});
 // }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      console.log('user logout!' + this.isAuthenticated);
      this.router.navigate(['/']);
    });
  }

}
