import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';
import {NewSession} from './table.model';
import 'rxjs/operator/map';
import {UiService} from '../shared/ui.service';
import {AuthService} from '../shared/auth.service';
import {SocketService} from '../shared/socket.service';
import {AiService} from '../shared/ai.service';

export class Blocks {
  blockNumber: number;
  symbol: string;
  empty: boolean;
}

export class Game {
  playerX: any;
  playerO: any;
  draw: boolean;
  winner: string;
  turn: string;
  gameOver: boolean;
  emptyBlocks: boolean;
}

@Injectable()
export class GameService {
  OngoingGame$ = new Subject<boolean>();
  blocks: Blocks[] = [];
  game: Game;
  gameType: string;
  PlayersConnectionSubscription: Subscription;

  constructor(private authService: AuthService, private socketService: SocketService, private uiService: UiService) {
    this.game = this.initializeGame();
  }

  gameState(): void {
    this.hasMoves();
    this.checkWinner();
    this.changeTurn();
    if (this.game.winner) {
      this.game.gameOver = true;
      this.uiService.showSnackBar(`The Winner is ${this.game.winner}`, null, 5000);
    } else if ((!this.game.winner) && (!this.game.emptyBlocks)) {
      this.game.gameOver = true;
      this.game.draw = true;
      this.uiService.showSnackBar(`The game is a Draw!`, null, 5000);
    } else {
      this.game.gameOver = false;
    }
  }

  hasMoves(): boolean {
    for (let i = 0; i < 9; i++) {
      if (this.blocks[i].empty) {
        this.game.emptyBlocks = true;
        return true;
      }
    }
    this.game.emptyBlocks = false;
    return false;
  }

  changeTurn() {
    this.game.turn = 'X' ? this.game.turn = 'O' : this.game.turn = 'X';
  }

  initializeGame(): Game {
    const game = new Game();
    game.playerX = '';
    game.playerO = '';
    game.turn = 'X';
    game.winner = '';
    game.draw = false;
    game.gameOver = false;
    game.emptyBlocks = true;
    this.initializeBlocks();
    return game;
  }

  initializeBlocks(): Blocks[] {
    for (let i = 0; i < 9; i++) {
      const blocks = new Blocks();
      blocks.blockNumber = i;
      blocks.symbol = '';
      blocks.empty = true;
      this.blocks.push(blocks);
    }
    return this.blocks;
  }

  playerClick(position: number, symbol: string): void {
    this.game.turn = symbol;
    if (!this.blocks[position].empty) {
      this.uiService.showSnackBar('You cannot play this space!', null, 3000);
    } else if (this.game.turn !== symbol) {
      this.uiService.showSnackBar('Wait for your turn!', null, 3000);
    } else {
      this.blocks[position].symbol = symbol;
      this.blocks[position].empty = false;
      this.gameState();
      this.socketService.makeMove(position, this.game);
    }
  }

  selectNewGame(value: string) {
    this.gameType = value;
    if (value) {
      this.OngoingGame$.next(true);
    } else {
      this.OngoingGame$.next(false);
    }
  }

  // cancelSubscriptions() {
  //   this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
  // }

  checkWinner(): void {
    if ((!this.blocks[0].empty) && (this.blocks[0].symbol === this.blocks[1].symbol) && (this.blocks[1].symbol === this.blocks[2].symbol) && (this.blocks[0].symbol === this.blocks[2].symbol)) {
      this.game.winner = this.blocks[0].symbol;
    }
    if ((!this.blocks[3].empty) && (this.blocks[3].symbol === this.blocks[4].symbol) && (this.blocks[4].symbol === this.blocks[5].symbol) && (this.blocks[3].symbol === this.blocks[5].symbol)) {
      this.game.winner = this.blocks[3].symbol;
    }
    if ((!this.blocks[6].empty) && (this.blocks[6].symbol === this.blocks[7].symbol) && (this.blocks[7].symbol === this.blocks[8].symbol) && (this.blocks[6].symbol === this.blocks[8].symbol)) {
      this.game.winner = this.blocks[6].symbol;
    }
    if ((!this.blocks[0].empty) && (this.blocks[0].symbol === this.blocks[3].symbol) && (this.blocks[3].symbol === this.blocks[6].symbol) && (this.blocks[0].symbol === this.blocks[6].symbol)) {
      this.game.winner = this.blocks[0].symbol;
    }
    if ((!this.blocks[1].empty) && (this.blocks[1].symbol === this.blocks[4].symbol) && (this.blocks[4].symbol === this.blocks[7].symbol) && (this.blocks[1].symbol === this.blocks[7].symbol)) {
      this.game.winner = this.blocks[1].symbol;
    }
    if ((!this.blocks[2].empty) && (this.blocks[2].symbol === this.blocks[5].symbol) && (this.blocks[5].symbol === this.blocks[8].symbol) && (this.blocks[2].symbol === this.blocks[8].symbol)) {
      this.game.winner = this.blocks[2].symbol;
    }
    if ((!this.blocks[0].empty) && (this.blocks[0].symbol === this.blocks[4].symbol) && (this.blocks[4].symbol === this.blocks[8].symbol) && (this.blocks[0].symbol === this.blocks[8].symbol)) {
      this.game.winner = this.blocks[0].symbol;
    }
    if ((!this.blocks[0].empty) && (this.blocks[0].symbol === this.blocks[1].symbol) && (this.blocks[1].symbol === this.blocks[2].symbol) && (this.blocks[0].symbol === this.blocks[2].symbol)) {
      this.game.winner = this.blocks[0].symbol;
    }
    if ((!this.blocks[2].empty) && (this.blocks[2].symbol === this.blocks[4].symbol) && (this.blocks[4].symbol === this.blocks[6].symbol) && (this.blocks[2].symbol === this.blocks[6].symbol)) {
      this.game.winner = this.blocks[2].symbol;
    }
  }
}
