import { Component, OnInit } from '@angular/core';
import {GameService} from '../game.service';
import {BlockModel} from '../block.model';
import {GameModel} from '../game.model';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  constructor(private gameService: GameService) { }

  blocks: BlockModel[] = [];
  game: GameModel;
  invalidMessage = '';

  ngOnInit() {
    this.game = this.gameService.initializeGame();
    this.blocks = this.gameService.initializeBlocks();
  }

  playerClick(position: number) {
    this.gameService.playerClick(position);
  }

}
