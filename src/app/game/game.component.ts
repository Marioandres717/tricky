import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SocketService} from "../shared/socket.service";
import {AuthService} from "../shared/auth.service";

export interface GameProgress {
  players: string[],
  currentPlayer: string,
  grid: number[],
  roomId: string,
  winner: string
}

export interface User {
  name: string,
  assignedNumber: number
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit, OnDestroy {
  private gameSession = this.router.url.replace('/game/','');
  private session: any;
  private gameProgress: GameProgress;
  private user: User = {
    name: this.authService.userInfo().email,
    assignedNumber: undefined
  };


  grid: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  enableReset: boolean = false;

  constructor(private router: Router, private socketService: SocketService, private authService: AuthService) {}

  ngOnInit() {
    this.session = this.socketService.connectToServer(this.gameSession);
    this.socketService.gameUpdated(this.session, (gameStatus: GameProgress) => {

      if (gameStatus.players.length === 1) {
        console.log(`Opponent ${gameStatus.players[0]} is waiting for rematch `);
          // show waiting for opponent message
      }

      this.gameProgress = gameStatus;
      this.user.assignedNumber = this.gameProgress.players.indexOf(this.user.name) + 1;
      this.grid = this.gameProgress.grid;
    });

    this.socketService.gameOver(this.session, (gameOver) => {
      if (gameOver === this.user.name) {
          // update user winner here
        //  show user winner message
        } else {
          //update user lose here
        //show loser message :(
        }
      this.enableReset = true;
    });
  }

  private onPlayerClick(position: number) {
    console.log(this.gameProgress);
    if (this.gameProgress && this.gameProgress.currentPlayer === this.user.name) {
      if (!this.gameProgress.grid[position]) {
        this.gameProgress.grid[position] = this.user.assignedNumber;
        this.playerMove(this.gameProgress);
      } else {
        console.log('position already selected message here');
      }
    } else {
      console.log('Its not your turn message here!');
    }
  }

  private playerMove(gameProgress: GameProgress) {
    this.socketService.playerMove(this.session, gameProgress);
  }

  private resetGame(gameProgress: GameProgress) {
    this.socketService.resetGame(this.session, gameProgress);
  }

  ngOnDestroy() {
  }
}
