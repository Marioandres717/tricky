import {Component, EventEmitter, OnInit, Output} from '@angular/core';

export interface Player {
  username: string;
  win: number;
  lose: number;
  draw: number;
  totalGames: number;
  bot: boolean;
}

const PLAYER_DATA: Player[] = [
  {username: 'Marioandres717', win: 5, lose: 9, draw: 11, totalGames: 25, bot: false},
  {username: 'CREATION', win: 10, lose: 1, draw: 0, totalGames: 11, bot: false},
  {username: 'anonymous', win: 99, lose: 45, draw: 50, totalGames: 194, bot: false},
  {username: 'Alarakis', win: 15, lose: 20, draw: 10, totalGames: 45, bot: false},
];

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  dataSource = PLAYER_DATA;
  columnsToDisplay = ['username', 'win', 'draw'];
  @Output() reset = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  resetGame() {
    this.reset.emit('reset game');
  }

}
