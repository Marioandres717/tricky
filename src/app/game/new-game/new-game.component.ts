import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SocketService} from '../../shared/socket.service';
import {GameService} from '../game.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {
  gameSelected: FormGroup;
  constructor(private fb: FormBuilder, private socketService: SocketService, private gameService: GameService) { }

  ngOnInit() {
    this.gameSelected = this.fb.group({selectedGame: ''});
  }

  setGame(form) {
    console.log(form.value.selectedGame);
    this.gameService.selectNewGame(form.value.selectedGame);
    this.socketService.joinGame(form.value.selectedGame);
  }
}
