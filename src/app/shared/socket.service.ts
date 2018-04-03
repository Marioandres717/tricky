import { Injectable } from '@angular/core';
//noinspection TypeScriptCheckImport
import io from 'socket.io-client';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class SocketService {

  private userInfo = this.authService.userInfo();

  constructor(private authService: AuthService) { }

  public connectToServer(id: string) {
    const socket = io.connect(environment.path, {'forceNew': true});
    this.joinGame(socket, id);
    return socket;
  }
  private joinGame(socket: any, id: string) {
    socket.emit('join-game', { gameID: id, username: this.userInfo.email, photoURL: this.userInfo.photoURL });
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

  public resetGame(socket: any, gameStatus: any) {
    socket.emit('reset-game', { username: this.userInfo.email, gameStatus: gameStatus });
  }

  public disconnect(socket: any, disconnectFunction) {
    socket.on('opponent left', disconnectFunction);
  }

  public waitingForOpponent(socket: any, waitingFunction) {
    socket.on('waiting for opponent', waitingFunction);
  }

  public disconnectSession(socket: any) {
    socket.disconnect();
  }

}
