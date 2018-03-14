import {PlayerModel} from './player.model';

export class GameModel {
  gameId: number;
  turn: number;
  Winner: number;
  Draw: boolean;
  player?: PlayerModel[] = [];
}
