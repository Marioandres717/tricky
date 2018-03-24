import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MatDialog} from '@angular/material';
import {PlayerLeftComponent} from './player-left.component';
import {SocketService} from '../../shared/socket.service';
import {AuthService} from '../../shared/auth.service';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})

export class GameBoardComponent implements OnInit, OnDestroy {

  constructor(private uiService: UiService, private authService: AuthService, private socketService: SocketService, private dialog: MatDialog) { }
  opponentMoveSubscription$: Subscription;
  opponentLeftSubscription$: Subscription;
  newGameSubscription$: Subscription;
  blocks: string[];
  turn: any;
  player = this.authService.userInfo().email;
  playerSymbol: string;
  playerOne: any;
  playerTwo: any;
  winner: string;
  draw: boolean;

  ngOnInit() {
    this.newGameSubscription$ = this.socketService.newGameStarted()
    .subscribe((gameStatus: any) => {
      this.playerOne = gameStatus.playerOne;
      this.playerTwo = gameStatus.playerTwo;
      this.blocks = gameStatus.grid;
      this.turn = gameStatus.currentPlayer;
      this.winner = gameStatus.winner;
      this.draw = gameStatus.draw;

      if (this.playerOne === this.player) {
        this.playerSymbol = 'X';
      } else {
        this.playerSymbol = 'O';
      }
    });

    this.opponentMoveSubscription$ = this.socketService.displayMove().subscribe((gameStatus: any) => {
      this.blocks = gameStatus.grid;
      this.turn = gameStatus.currentPlayer;
      this.winner = gameStatus.winner;
      this.draw = gameStatus.draw;
      console.log('el primer winner: ', gameStatus);

      if (this.winner === 'noWinner') {
        console.log(this.winner);
      } else {
        this.turn = '';
        console.log(this.winner);
        this.uiService.showSnackBar(`This winner is ${this.winner}`, null, 5000);
      }

      if(this.draw === true) {
        this.turn = '';
        this.uiService.showSnackBar(`The game is a draw`, null, 5000);
      }
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
    this.newGameSubscription$.unsubscribe();
    this.opponentMoveSubscription$.unsubscribe();
    this.opponentLeftSubscription$.unsubscribe();
  }

  onPlayerClick(blockPosition: number) {
    if (this.blocks[blockPosition]) {
      this.uiService.showSnackBar('You cannot play this block! try a different one', null, 3000);
    } else if (this.turn !== this.player) {
      this.uiService.showSnackBar('Wait for your turn!', null, 3000);
    } else {
      this.blocks[blockPosition] = this.playerSymbol;
      const NewGameState = {
        playerOne: this.playerOne,
        playerTwo: this.playerTwo,
        currentPlayer: this.turn,
        grid: this.blocks,
        winner: this.winner,
        draw: this.draw
      }
      this.turn = '';
      this.socketService.makeMove(blockPosition, NewGameState);
    }
  }
}
