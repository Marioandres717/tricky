import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from '../game.service';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog} from '@angular/material';
import {PlayerLeftComponent} from './player-left.component';
import {SocketService} from '../../shared/socket.service';
import {AuthService}  from '../../shared/auth.service';
import {UiService}  from '../../shared/ui.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})

export class GameBoardComponent implements OnInit, OnDestroy {

  constructor(private uiService: UiService, private authService: AuthService, private socketService: SocketService, private dialog: MatDialog, private gameService: GameService) { }
  opponentMoveSubscription$: Subscription;
  opponentLeftSubscription$: Subscription;
  symbolSubscription$: Subscription;
  newGameSubscription$: Subscription;
  blocks: string[];
  turn: any;
  player = this.authService.userInfo().email;
  CurrentTurn: any;
  playerSymbol = 'X';
  playerOne: any;
  playerTwo: any;



  ngOnInit() {
    this.newGameSubscription$ = this.socketService.newGameStarted()
    .subscribe((gameStatus: any) => {
      this.playerOne = gameStatus.playerOne;
      this.playerTwo = gameStatus. PlayerTwo;
      this.blocks = gameStatus.grid;
      this.turn = gameStatus.CurrentTurn;
    });
    
    this.opponentMoveSubscription$ = this.socketService.displayMove().subscribe(opponentMove => {
      // if (this.playerSymbol === 'X') {
      //   this.blocks[opponentMove].symbol = 'O'
      // } 
      // if (this.playerSymbol === 'O') {
      //   this.blocks[opponentMove].symbol = 'X'
      // }
    });

    this.opponentLeftSubscription$ = this.socketService.leftGame().subscribe(opponentLeft => {
      const dialogRef = this.dialog.open(PlayerLeftComponent, {data: {
        opponentInfo: opponentLeft
        }});
      dialogRef.afterClosed().subscribe(result => {
        // this.socketService.selectNewGame(null);
      });
    });
  }

  ngOnDestroy() {
    this.opponentMoveSubscription$.unsubscribe();
    this.opponentLeftSubscription$.unsubscribe();
  }

  onPlayerClick(blockPosition: number) {
    if (this.blocks[blockPosition]) {
      this.uiService.showSnackBar('You cannot play this block! try a different one', null, 3000);
    }
    else if (this.CurrentTurn !== this.player) {
      this.uiService.showSnackBar('Wait for your turn!', null, 3000);
    } else {
      this.blocks[blockPosition] = this.playerSymbol;
      const NewGameState = {
        playerOne: this.playerOne,
        playerTwo: this.playerTwo,
        CurrentPlayer: this.turn,
        grid: this.blocks
      }
      this.socketService.makeMove(blockPosition, NewGameState);
    }
  }
}
