import {Component, OnDestroy, OnInit} from '@angular/core';
import {Blocks, Game, GameService} from './game.service';
import {Router} from "@angular/router";
import {SocketService} from "../shared/socket.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit, OnDestroy {
  private gameSession = this.router.url.replace('/game/','');
  private session: any;
  private gameProgress: any;

  constructor( private router: Router, private socketService: SocketService) {}

  ngOnInit() {
    this.session = this.socketService.connectToServer(this.gameSession);
    this.socketService.gameUpdated(this.session, (gameStatus: any) => {
      this.gameProgress = gameStatus;
    });
  }

  private playerMove() {
    this.socketService.playerMove(this.session, this.gameProgress);
  }
  ngOnDestroy() {
  }
}
