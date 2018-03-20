import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {Game} from '../game/game.service';

@Injectable()
export class SocketService {
  private socket = io.connect('http://localhost:8080', {'forceNew': true});

  constructor() { }

  joinGame(id: string) {
    this.socket.emit('join game', {gameID: id});
  }

  newGameStarted() {
    const newGame = new Observable<string>(observer => {
      this.socket.on('new game', (symbol) => {
        observer.next(symbol);
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

  makeMove(position: number, gameStatus: Game) {
    console.log(gameStatus);
    this.socket.emit('player move', position, gameStatus);
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
