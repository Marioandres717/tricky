import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from './game.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit, OnDestroy {
  selectedGameSubscription$: Subscription;
  onGoingGame = false;

  constructor( public gameService: GameService ) {}


  ngOnInit() {
    this.selectedGameSubscription$ = this.gameService.OngoingGame$.subscribe(game => { this.onGoingGame = game; });
  }

  ngOnDestroy() {
    this.selectedGameSubscription$.unsubscribe();
  }

  resetGame(event) {
    location.reload();
    event.preventDefault();
  }

}


