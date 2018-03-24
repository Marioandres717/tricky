import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NewSession} from '../game/table.model';

@Injectable()
export class SessionService {
  private base = environment.base;
  private auth = environment.secret;

  constructor(private http: HttpClient) { }

  getAllSessions() {
      return this.http.get(`${this.base}/gameTables.json?${this.auth}`);
  }

  getSession(sessionId: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.base}/gameTables/${sessionId}.json?${this.auth}`).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  createSession(params: NewSession) {
    return this.http.post(`${this.base}/gameTables.json?${this.auth}`, params);
  }
}
