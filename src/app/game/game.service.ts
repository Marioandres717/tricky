import { Injectable } from '@angular/core';
import { BlockModel} from './block.model';
import {GameModel} from './game.model';
import {Subject} from 'rxjs/Subject';
import io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {observable} from 'rxjs/symbol/observable';

@Injectable()
export class GameService {
  newGame = new GameModel;
  blocks: BlockModel[] = [];
  OngoingGame$ = new Subject<boolean>();

  private socket = io.connect('http://localhost:8080', {'forceNew': true});

  joinGame(data: string) {
    this.socket.emit('join game', {gameType: data});
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

  selectNewGame(value: string) {
    if (value) {
      this.OngoingGame$.next(true);
    } else {
      this.OngoingGame$.next(false);
    }
  }

  initializeGame() {
    this.newGame.gameId = Math.round(Math.random() * 10 + 1);
    this.newGame.turn = 0;
    this.newGame.Winner = null;
    this.newGame.Draw = null;
    // console.log(this.newGame.gameId);
    return this.newGame;
  }

  initializeBlocks(): BlockModel[] {
    for (let i = 0; i < 9; i++) {
      const new_block = new BlockModel();
      new_block.blockId = i;
      new_block.free = true;
      new_block.userId = null;
      new_block.value = '';
      this.blocks.push(new_block);
    }
    return this.blocks;
  }

  playerClick(position: number) {
    if (this.blocks[position].free) {
      if (this.newGame.turn === 0) {
        this.blocks[position].value = 'X';
        this.newGame.turn = 1;
        this.blocks[position].userId = 12345;
        this.blocks[position].free = false;

        this.makeMove(position);
        // this.invalidMessage = '';
      } else {
        this.blocks[position].value = 'O';
        this.newGame.turn = 0;
        this.blocks[position].userId = 67890;
        this.blocks[position].free = false;
        // this.invalidMessage = '';
      }
    } else {
      // this.invalidMessage = 'The block is being used!';
    }
    console.log(this.blocks[position]);
  }
}
