import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from './game.service';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit, OnDestroy {
  selectedGameSubscription$: Subscription;
  onGoingGame = false;
  // message: string;
  constructor( public gameService: GameService ) {}


  ngOnInit() {
    // this.gameService.testMessage().subscribe(data => this.message = data.msg);
    // console.log(this.message);
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


