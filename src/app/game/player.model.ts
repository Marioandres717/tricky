export class PlayerModel {
  playerId: number;
  bot: boolean;
  num_wins: number;
  num_draws: number;
  isAvalable: boolean;
  status: 'online' | 'away' | 'offline';
}
