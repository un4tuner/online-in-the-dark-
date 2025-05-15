import mongoose, { Schema } from 'mongoose';

export type UserRole = 'superuser' | 'master' | 'player';

export type User = {
  createdAt: Date;
  username: string;
  password: string;
  portrait: string;
  isGuest: boolean;
  games: string[];
  role: UserRole;
};

export type UserDocument = User & mongoose.Document;

const UserSchema = new Schema<UserDocument>({
  createdAt: Date,
  username: String,
  password: String,
  portrait: String,
  isGuest: Boolean,
  games: [String],
  role: { type: String, enum: ['superuser', 'master', 'player'], default: 'player' }
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
