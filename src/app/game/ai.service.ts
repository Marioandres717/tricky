import { Injectable } from '@angular/core';
import {GameService} from './game.service';

@Injectable()
export class AiService {

  constructor(private gameService: GameService) { }


}
