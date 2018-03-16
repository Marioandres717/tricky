import { Injectable } from '@angular/core';
import {GameService} from '../game/game.service';

@Injectable()
export class ChatService {

  constructor(private gameService: GameService) { }

}
