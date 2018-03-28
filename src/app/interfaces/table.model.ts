export interface NewSession {
  id: string;
  name: string;
  user: string;
  created: Date;
  numberOfPlayers: number;
  players: Array<string>;
}
