import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SocketService {
  private socket = io.connect('http://localhost:8080', {'forceNew': true});

  constructor() { }

  joinGame(id: string) {
    this.socket.emit('join game', {gameID: id});
  }

  newGameStarted() {
    const newGame = new Observable<string>(observer => {
      this.socket.on('new game', (welcomeMessage) => {
        observer.next(welcomeMessage);
      });
      return () => { this.socket.disconnect(); };
    });
    return newGame;
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
    const opponentsMove = new Observable<number>(observer => {
      this.socket.on('opponent move', (blockId) => {
        observer.next(blockId);
      });
      return () => { this.socket.disconnect(); };
    });
    return opponentsMove;
  }

  makeMove(blockId: number) {
    this.socket.emit('player move', blockId);
  }

  messageSend(messageContent: string) {
    // HERE WE HAVE TO ADD THE USER INFORMATION & TIME STAMP
    this.socket.emit('send-message', messageContent);
  }

  messageReceived() {
    const MessageFromOtherUSer = new Observable<string>(observer => {
      this.socket.on('receive-message', (message) => {
        observer.next(message);
      });
      return () => { this.socket.disconnect(); };
    });
    return MessageFromOtherUSer;
  }
}
