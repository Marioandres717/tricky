import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NewSession} from '../game/table.model';

@Injectable()
export class SessionService {
  private base = environment.base;
  private auth = environment.secret;

  constructor(private http: HttpClient) { }

  getSession(sessionId: string) {
    this.http.get(`${this.base}/gameTables.json?${this.auth}`).subscribe(data => {
      console.log(data);
    });
  }

  createSession(params: NewSession) {
    this.http.post(`${this.base}/gameTables.json?${this.auth}`, params).subscribe(data => {
      console.log(data);
    });
  }
}
