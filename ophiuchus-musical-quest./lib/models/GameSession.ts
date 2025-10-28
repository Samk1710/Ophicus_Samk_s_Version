import mongoose, { Schema, Document } from 'mongoose';

export interface ISong {
  id: string;
  name: string;
  artists: string[];
  album: string;
  imageUrl: string;
  spotifyUrl?: string;
}

export interface IRoomClue {
  clue?: string;
  correct?: boolean;
  score?: number;
  attempts?: number;
  completed?: boolean;
  audioUrl?: string;
}

export interface IGameSession extends Document {
  userId: string;
  spotifyUserId: string;
  cosmicSong: ISong;
  intermediarySongs: ISong[];
  initialClue: string;
  roomsCompleted: string[];
  roomClues: {
    nebula?: IRoomClue;
    cradle?: IRoomClue;
    comet?: IRoomClue;
    aurora?: IRoomClue;
    nova?: IRoomClue;
  };
  finalGuesses: number;
  completed: boolean;
  ophiuchusIdentity?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  artists: [{ type: String, required: true }],
  album: { type: String, required: true },
  imageUrl: { type: String, required: true },
  spotifyUrl: { type: String }
});

const RoomClueSchema = new Schema({
  clue: { type: String },
  correct: { type: Boolean },
  score: { type: Number },
  attempts: { type: Number },
  completed: { type: Boolean, default: false },
  audioUrl: { type: String }
});

const GameSessionSchema = new Schema({
  userId: { type: String, required: true },
  spotifyUserId: { type: String, required: true },
  cosmicSong: { type: SongSchema, required: true },
  intermediarySongs: [SongSchema],
  initialClue: { type: String, required: true },
  roomsCompleted: [{ type: String }],
  roomClues: {
    nebula: { type: RoomClueSchema },
    cradle: { type: RoomClueSchema },
    comet: { type: RoomClueSchema },
    aurora: { type: RoomClueSchema },
    nova: { type: RoomClueSchema }
  },
  finalGuesses: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  ophiuchusIdentity: { type: String }
}, {
  timestamps: true
});

// Index for faster queries
GameSessionSchema.index({ userId: 1, createdAt: -1 });
GameSessionSchema.index({ spotifyUserId: 1 });

export default mongoose.models.GameSession || mongoose.model<IGameSession>('GameSession', GameSessionSchema);
