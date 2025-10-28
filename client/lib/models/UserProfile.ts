import mongoose, { Schema, Document } from 'mongoose';

export interface ICompletedGame {
  sessionId: string;
  cosmicSong: {
    id: string;
    name: string;
    artists: string[];
  };
  totalPoints: number;
  roomPoints: {
    nebula: number;
    cradle: number;
    comet: number;
    aurora: number;
    nova: number;
  };
  finalGuessAttempts: number;
  ophiuchusIdentity: {
    title: string;
    description: string;
    imageUrl: string;
  };
  completedAt: Date;
}

export interface IUserProfile extends Document {
  userId: string;
  spotifyUserId: string;
  username: string;
  totalGamesPlayed: number;
  totalPoints: number;
  completedGames: ICompletedGame[];
  createdAt: Date;
  updatedAt: Date;
}

const CompletedGameSchema = new Schema({
  sessionId: { type: String, required: true },
  cosmicSong: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    artists: [{ type: String, required: true }]
  },
  totalPoints: { type: Number, required: true },
  roomPoints: {
    nebula: { type: Number, default: 0 },
    cradle: { type: Number, default: 0 },
    comet: { type: Number, default: 0 },
    aurora: { type: Number, default: 0 },
    nova: { type: Number, default: 0 }
  },
  finalGuessAttempts: { type: Number, required: true },
  ophiuchusIdentity: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  completedAt: { type: Date, required: true }
});

const UserProfileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  spotifyUserId: { type: String, required: true },
  username: { type: String, required: true },
  totalGamesPlayed: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  completedGames: [CompletedGameSchema]
}, {
  timestamps: true
});

// Indexes for faster queries
UserProfileSchema.index({ userId: 1 });
UserProfileSchema.index({ spotifyUserId: 1 });
UserProfileSchema.index({ totalPoints: -1 }); // For leaderboard sorting

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
