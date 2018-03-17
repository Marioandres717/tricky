import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from '../game.service';
import {BlockModel} from '../block.model';
import {GameModel} from '../game.model';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog} from '@angular/material';
import {PlayerLeftComponent} from './player-left.component';


@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService, private dialog: MatDialog) { }

  blocks: BlockModel[] = [];
  game: GameModel;
  invalidMessage = '';
  opponentMoveSubscription: Subscription;
  opponentLeftSubscription: Subscription;

  ngOnInit() {
    // console.log('llamando el constructor');
    this.game = this.gameService.initializeGame();

    this.blocks = this.gameService.initializeBlocks();

    this.opponentMoveSubscription = this.gameService.displayMove().subscribe(opponentMove => {
      this.blocks[opponentMove].value = 'O';
    });

    this.opponentLeftSubscription = this.gameService.leftGame().subscribe(opponentLeft => {
      const dialogRef = this.dialog.open(PlayerLeftComponent, {data: {
        opponentInfo: opponentLeft
        }});
      dialogRef.afterClosed().subscribe(result => {
        this.gameService.selectNewGame(null);
      });
    });
  }

  ngOnDestroy() {
    // console.log('llamando el destructor');
    this.blocks.splice(0, this.blocks.length);
    this.game = null;
    this.opponentMoveSubscription.unsubscribe();
    this.opponentLeftSubscription.unsubscribe();
  }

  playerClick(position: number) {
    // console.log(this.blocks.length);
    this.gameService.playerClick(position);
  }

}
