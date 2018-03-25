import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NewSession} from '../game/table.model';
import {UserProfile} from "../interfaces/user.model";

@Injectable()
export class SessionService {
  private base = environment.base;
  private auth = environment.secret;

  constructor(private http: HttpClient) { }

  getAllSessions() {
    return this.http.get(`${this.base}/gameTables.json?${this.auth}`);
  }

  getSession(sessionId: string) {
    return this.http.get(`${this.base}/gameTables/${sessionId}.json?${this.auth}`);
  }

  createSession(params: NewSession) {
    return this.http.post(`${this.base}/gameTables.json?${this.auth}`, params);
  }
}

@Injectable()
export class UserService {
  private base = environment.base;
  private auth = environment.secret;
  private options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient) {}

  getUserProfile(user_uid: string) {
    this.options['params'] = {
      orderBy: '"user_uid"',
      equalTo: `"${user_uid}"`
    };
    return this.http.get(`${this.base}/users.json?${this.auth}`, this.options);
  }

  createUserProfile(params: any) {
    return this.http.post(`${this.base}/users.json?${this.auth}`, params);
  }

  updateUserProfile(params: UserProfile) {
    this.getUserProfile(params.user_uid).subscribe(data => {
      /* TODO: maybe the user should be created here if data === null
      (this error could happen if the user profile is not created when the user is created or
      if the user profile was deleted manually in the bd )
      */
      let key = Object.keys(data)[0];
      this.http.patch(`${this.base}/users/${key}.json?${this.auth}`, params)
        .subscribe(() => {}, err => console.log(`${err}, failed to update user profile`))
    }, err => {
      console.log(`${err}, failed to get user profile`);
    });
  }
}
