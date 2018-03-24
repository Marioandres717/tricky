import { Injectable } from '@angular/core';
//noinspection TypeScriptCheckImport
import io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
import {Message} from '../chat/chat.component';

@Injectable()
export class SocketService {
  private socket = io.connect(environment.path, {'forceNew': true});

  constructor(private authService: AuthService) { }

  joinGame(id: string) {
    const userInfo = this.authService.userInfo();
    console.log(userInfo);
    this.socket.emit('join game', {gameID: id, username: userInfo.email });
  }

  newGameStarted() {
    const newGame = new Observable<Object>(observer => {
      this.socket.on('game starts', (gameStatus: any) => {
        observer.next(gameStatus);
      });
      return () => { this.socket.disconnect(); };
    });
    return newGame;
  }

  waitingForGame() {
    const waiting = new Observable<Object>(observer => {
      this.socket.on('opponent not found', (status) => {
        observer.next(status);
      });
      return () => { this.socket.disconnect(); };
    });
    return waiting;
  }

  leftGame() {
    const PlayerLeft = new Observable<string>(observer => {
      this.socket.on('opponent left', (message) => {
        observer.next(message);
      });
      return () => { this.socket.disconnect(); };
    });
    return PlayerLeft;
  }

  displayMove() {
    const opponentsMove = new Observable<any>(observer => {
      this.socket.on('opponent move', (gameStatus) => {
        observer.next(gameStatus);
      });
      return () => { this.socket.disconnect(); };
    });
    return opponentsMove;
  }

  makeMove(position: number, gameStatus: any) {
    console.log(gameStatus);
    this.socket.emit('player move', position, gameStatus);
  }

  messageSend(message: Message) {
    // HERE WE HAVE TO ADD THE USER INFORMATION & TIME STAMP
    this.socket.emit('send-message', message);
  }

  messageReceived() {
    const MessageFromOtherUSer = new Observable<Message>(observer => {
      this.socket.on('receive-message', (message) => {
        observer.next(message);
      });
      return () => { this.socket.disconnect(); };
    });
    return MessageFromOtherUSer;
  }
}
