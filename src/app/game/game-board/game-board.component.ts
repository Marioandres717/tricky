import {Component, OnDestroy, OnInit} from '@angular/core';
import {Blocks, Game, GameService} from '../game.service';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog} from '@angular/material';
import {PlayerLeftComponent} from './player-left.component';
import {SocketService} from '../../shared/socket.service';


@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})

export class GameBoardComponent implements OnInit, OnDestroy {

  constructor(private socketService: SocketService, private dialog: MatDialog, private gameService: GameService) { }
  opponentMoveSubscription: Subscription;
  opponentLeftSubscription: Subscription;
  symbolSubscription: Subscription;
  blocks: Blocks[];
  game: Game;
  playerSymbol: string;

  ngOnInit() {
    this.game = this.gameService.game;
    this.blocks = this.gameService.blocks;
    
    this.symbolSubscription = this.socketService.newGameStarted()
    .subscribe((playerSymbol: string) => {
      if (!this.playerSymbol) this.playerSymbol = playerSymbol; 
      console.log('el symbolo del jugador es: ' + playerSymbol); 
    });

    this.opponentMoveSubscription = this.socketService.displayMove().subscribe(opponentMove => {
      if (this.playerSymbol === 'X') {
        this.blocks[opponentMove].symbol = 'O'
      } 
      if (this.playerSymbol === 'O') {
        this.blocks[opponentMove].symbol = 'X'
      }
    });

    this.opponentLeftSubscription = this.socketService.leftGame().subscribe(opponentLeft => {
      const dialogRef = this.dialog.open(PlayerLeftComponent, {data: {
        opponentInfo: opponentLeft
        }});
      dialogRef.afterClosed().subscribe(result => {
        // this.socketService.selectNewGame(null);
      });
    });
  }

  ngOnDestroy() {
    this.opponentMoveSubscription.unsubscribe();
    this.opponentLeftSubscription.unsubscribe();
  }

  onPlayerClick(blockPosition: number) {
    this.gameService.playerClick(blockPosition, this.playerSymbol);
  }
}
