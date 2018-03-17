import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
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
  user: Observable<User>;
  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {

    /// Get auth data, then get Firestore user document || null
    // We want to define the user observable so any part of the app can subscribe to it and receive updates on real-time
    // this.user = this.afAuth.authState.switchMap(user => {
    //   if (user) {
    //     return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //   } else {
    //     return Observable.of(null);
    //   }
    // });
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

  public loginUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then((data) => {
        resolve(data);
      }, (err) => {
        resolve(err);
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
      // Stores in the db
      return userRef.set(Object.assign({}, data), {merge: true});
  }

  public checkForAuth() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        console.log('esta llamando todo esto?');
        this.router.navigate(['/home']);
      } else {
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/']);
      }
    });
    return this.isAuthenticated;
  }

  public getAuthState() {
    console.log('esto lo llama el guard');
    return this.isAuthenticated;
  }

  signOut() {
    this.authChange.next(false);
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}
