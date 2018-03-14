import { Injectable } from '@angular/core';
import { BlockModel} from './block.model';
import {PlayerModel} from './player.model';
import {GameModel} from './game.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class GameService {
  newGame = new GameModel;
  blocks: BlockModel[] = [];
  OngoingGame$ = new Subject<boolean>();

  selectNewGame(value: string) {
    if (value) {
      this.OngoingGame$.next(true);
    }
  }

  initializeGame() {
    this.newGame.gameId = Math.round(Math.random() * 10 + 1);
    this.newGame.turn = 0;
    this.newGame.Winner = null;
    this.newGame.Draw = null;
    console.log(this.newGame.gameId);
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
