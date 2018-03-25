export interface UserProfile {
  user_uid: string;
  user_email?: string;
  user_photo_url?: string;
  user_nickname?: string;
  user_birth?: Date;
  user_total_wins?: number;
  user_total_games?: number;
}
