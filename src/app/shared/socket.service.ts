import { Injectable } from '@angular/core';
//noinspection TypeScriptCheckImport
import io from 'socket.io-client';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class SocketService {

  constructor(private authService: AuthService) { }

  public connectToServer(id: string) {
    const socket = io.connect(environment.path, {'forceNew': true});
    this.joinGame(socket, id);
    return socket;
  }
  private joinGame(socket: any, id: string) {
    const userInfo = this.authService.userInfo();
    socket.emit('join-game', { gameID: id, username: userInfo.email });
  }

  public playerMove(socket: any, gameUpdate: any) {
    return socket.emit('player-move', gameUpdate);
  }

  public gameUpdated(socket: any, updateFunction) {
    socket.on('game-updated', updateFunction);
  }

  public gameOver(socket: any, gameOverFunction) {
    socket.on('game-over', gameOverFunction);
  }

  // newGameStarted() {
  //   const newGame = new Observable<Object>(observer => {
  //     this.socket.on('game starts', (gameStatus: any) => {
  //       observer.next(gameStatus);
  //     });
  //     return () => { this.socket.disconnect(); };
  //   });
  //   return newGame;
  // }

  // waitingForGame() {
  //   const waiting = new Observable<Object>(observer => {
  //     this.socket.on('opponent not found', (status) => {
  //       observer.next(status);
  //     });
  //     return () => { this.socket.disconnect(); };
  //   });
  //   return waiting;
  // }

  // leftGame() {
  //   const PlayerLeft = new Observable<string>(observer => {
  //     this.socket.on('opponent left', (message) => {
  //       observer.next(message);
  //     });
  //     return () => { this.socket.disconnect(); };
  //   });
  //   return PlayerLeft;
  // }

  // displayMove() {
  //   const opponentsMove = new Observable<any>(observer => {
  //     this.socket.on('opponent move', (gameStatus) => {
  //       observer.next(gameStatus);
  //     });
  //     return () => { this.socket.disconnect(); };
  //   });
  //   return opponentsMove;
  // }

  // makeMove(position: number, gameStatus: any) {
  //   console.log(gameStatus);
  //   this.socket.emit('player move', position, gameStatus);
  // }

  // messageSend(messageContent: string) {
  //   // HERE WE HAVE TO ADD THE USER INFORMATION & TIME STAMP
  //   this.socket.emit('send-message', messageContent);
  // }

  // messageReceived() {
  //   const MessageFromOtherUSer = new Observable<string>(observer => {
  //     this.socket.on('receive-message', (message) => {
  //       observer.next(message);
  //     });
  //     return () => { this.socket.disconnect(); };
  //   });
  //   return MessageFromOtherUSer;
  // }
}
