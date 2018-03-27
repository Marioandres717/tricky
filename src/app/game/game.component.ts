import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {SocketService} from '../shared/socket.service';
import {AuthService} from '../shared/auth.service';
import {SessionService, UserService} from '../api/api.service';
import {UserProfile} from '../interfaces/user.model';
import {UiService} from '../shared/ui.service';
import {PlayerLeftComponent} from './player-left.component';
import {MatDialog} from '@angular/material';
import {RematchComponent} from './rematch.component';


export interface GameProgress {
  players: string[];
  currentPlayer: string;
  grid: number[];
  roomId: string;
  winner: string;
}

export interface User {
  name: string;
  assignedNumber: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit, OnDestroy {
  private gameSession = this.router.url.replace('/game/', '');
  private session: any;
  private gameProgress: GameProgress;
  private user: User = {
    name: this.authService.userInfo().email,
    assignedNumber: undefined
  };
  private userProfile: UserProfile;
  private onGoingGame: boolean;

  grid: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  enableClick: boolean;

  constructor(private router: Router, private socketService: SocketService, private authService: AuthService, private userService: UserService,
              private uiService: UiService, private dialog: MatDialog, private sessionService: SessionService) {}

  ngOnInit() {
    this.session = this.socketService.connectToServer(this.gameSession);
    this.sessionService.updateSession(this.gameSession, {numberOfPlayers: +1}).subscribe((data) => {
      console.log('la database fue actualizada!', data);
    });

    this.socketService.waitingForOpponent(this.session, (opponentFound: boolean) => {
      this.onGoingGame = opponentFound;
    });

    this.socketService.gameUpdated(this.session, (gameStatus: GameProgress) => {
      this.onGoingGame = true;
        if (gameStatus.players.length === 1) {
        console.log(`Opponent ${gameStatus.players[0]} is waiting for rematch `);
          const dialogRef = this.dialog.open(RematchComponent,  { data: {
            opponentName: 'Do you want a rematch?'
            }});
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.resetGame(gameStatus);
            } else {
              this.sessionService.deleteSession(this.gameSession).subscribe();
              this.router.navigate(['/home']);
            }
          });
      }
      if (gameStatus.currentPlayer === this.user.name) {
          this.enableClick = true;
      }
      this.gameProgress = gameStatus;
      this.user.assignedNumber = this.gameProgress.players.indexOf(this.user.name) + 1;
      this.grid = this.gameProgress.grid;
    });

    this.socketService.disconnect(this.session, (opponentLeft: string) => {
      const dialogRef = this.dialog.open(PlayerLeftComponent, { data: {
          opponentInfo: opponentLeft
          }});
        dialogRef.afterClosed().subscribe(result => {
          this.sessionService.deleteSession(this.gameSession).subscribe();
          this.router.navigate(['/home']);
        });
    });

    this.socketService.gameOver(this.session, (gameOver) => {
      console.log(gameOver);
      if (gameOver === 'draw') {
        this.userProfile.user_total_games += 1;
        this.userService.updateUserProfile(this.userProfile);
        this.uiService.showSnackBar(`The game is a Draw`, null, 10000);
        this.resetGame(this.gameProgress);
      } else if (gameOver === this.user.name) {
        this.userProfile.user_total_games += 1;
        this.userProfile.user_total_wins += 1;
        this.userService.updateUserProfile(this.userProfile);
        this.uiService.showSnackBar(`Congratz ${gameOver} you have Won!`, null, 10000);
        this.resetGame(this.gameProgress);
        } else {
        this.userProfile.user_total_games += 1;
        this.userService.updateUserProfile(this.userProfile);
        this.uiService.showSnackBar(`You lose!, the winner is ${gameOver}`, null, 10000);
        this.resetGame(this.gameProgress);
        }
    });

    this.userService.getUserProfile(this.authService.userInfo().uid).subscribe((userProfile: UserProfile) => {
      let key = Object.keys(userProfile)[0];
      this.userProfile = userProfile[key];
    }, err => {
      console.log(`${err}, failed to load user profile`);
    });
  }

  ngOnDestroy() {
    this.socketService.disconnectSession(this.session);
  }

  public onPlayerClick(position: number) {
    console.log(this.gameProgress);
    if (this.enableClick && this.gameProgress && this.gameProgress.currentPlayer === this.user.name) {
      if (!this.gameProgress.grid[position]) {
        this.enableClick = false;
        this.gameProgress.grid[position] = this.user.assignedNumber;
        this.playerMove(this.gameProgress);
      } else {
        this.uiService.showSnackBar('This space has been already taken!, play a different one', null, 3000);
      }
    } else {
      this.uiService.showSnackBar('You have to wait for your turn!', null, 3000);
    }
  }

  private playerMove(gameProgress: GameProgress) {
    this.socketService.playerMove(this.session, gameProgress);
  }

  private resetGame(gameProgress: GameProgress) {
    this.socketService.resetGame(this.session, gameProgress);
  }
}
