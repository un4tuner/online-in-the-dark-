import mongoose, { Schema } from 'mongoose';

export enum PlayerRole {
  PLAYER = 'player',
  GM = 'gm',
  ADMIN = 'admin'
}

export type Player = {
  username: string;
  portrait: string;
  isGuest: boolean;
  role: PlayerRole;
  isOnline: boolean;
};

export type Game = {
  _id: string;
  name: string;
  coverImage: string;
  dateCreated: Date;
  inviteCode: string;

  players: Record<string, Player>;

  gms: string[];

  lastActive: Date;

  data: any;

  codex: any;
};

export type GameDocument = Game & mongoose.Document;

const GameSchema = new Schema<GameDocument>({
  name: { type: String, required: true },
  coverImage: { type: String, required: true },
  dateCreated: { type: Date, required: true },
  inviteCode: { type: String, required: true },

  players: { type: Object, required: true },

  gms: { type: [String], required: true, default: [] },

  lastActive: { type: Date, required: true, default: Date.now },

  data: { type: Object, required: false },

  codex: { type: Object, required: false }
});

export const GameModel = mongoose.model<GameDocument>('Game', GameSchema);
