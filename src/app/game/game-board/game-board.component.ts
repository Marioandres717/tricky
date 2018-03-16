import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from '../game.service';
import {BlockModel} from '../block.model';
import {GameModel} from '../game.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService) { }

  blocks: BlockModel[] = [];
  game: GameModel;
  invalidMessage = '';
  opponentMoveSubscription: Subscription;

  ngOnInit() {
    // console.log('llamando el constructor');
    this.game = this.gameService.initializeGame();
    this.blocks = this.gameService.initializeBlocks();
    this.opponentMoveSubscription = this.gameService.displayMove().subscribe(opponentMove => {
      this.blocks[opponentMove].value = 'O';
    });
  }

  ngOnDestroy() {
    // console.log('llamando el destructor');
    this.blocks.splice(0, this.blocks.length);
    this.game = null;
    this.opponentMoveSubscription.unsubscribe();
  }

  playerClick(position: number) {
    // console.log(this.blocks.length);
    this.gameService.playerClick(position);
  }

}
