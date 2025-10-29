import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  userId: string;
  username: string;
  spotifyUserId: string;
  totalPoints: number;
  totalGamesCompleted: number;
  highestSingleGamePoints: number;
  lastPlayedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  spotifyUserId: { type: String, required: true },
  totalPoints: { type: Number, default: 0 },
  totalGamesCompleted: { type: Number, default: 0 },
  highestSingleGamePoints: { type: Number, default: 0 },
  lastPlayedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for faster queries
LeaderboardSchema.index({ totalPoints: -1 }); // For leaderboard sorting
LeaderboardSchema.index({ userId: 1 });
LeaderboardSchema.index({ lastPlayedAt: -1 });

export default mongoose.models.Leaderboard || mongoose.model<ILeaderboardEntry>('Leaderboard', LeaderboardSchema);
