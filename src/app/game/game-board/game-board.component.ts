import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from '../game.service';
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

  constructor(private socketService: SocketService, private dialog: MatDialog) { }
  opponentMoveSubscription: Subscription;
  opponentLeftSubscription: Subscription;

  ngOnInit() {

    this.opponentMoveSubscription = this.socketService.displayMove().subscribe(opponentMove => {
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

  playerClick(position: number) {
    // console.log(this.blocks.length);
  }

}
