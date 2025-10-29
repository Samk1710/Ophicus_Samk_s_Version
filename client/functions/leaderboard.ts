import GameSession, { IGameSession } from '@/lib/models/GameSession';
import UserProfile, { ICompletedGame } from '@/lib/models/UserProfile';
import Leaderboard from '@/lib/models/Leaderboard';
import connectDB from '@/lib/mongodb';

export async function completeGameSession(sessionId: string): Promise<void> {
  console.log('[completeGameSession] Processing completion for session:', sessionId);
  await connectDB();

  const session = await GameSession.findById(sessionId);
  if (!session) {
    console.error('[completeGameSession] Session not found');
    throw new Error('Session not found');
  }

  if (!session.completed) {
    console.error('[completeGameSession] Session not marked as completed');
    throw new Error('Session not completed');
  }

  // Calculate points for each room
  const roomPoints = {
    nebula: session.roomClues?.nebula?.points || 0,
    cradle: session.roomClues?.cradle?.points || 0,
    comet: session.roomClues?.comet?.points || 0,
    aurora: session.roomClues?.aurora?.points || 0,
    nova: session.roomClues?.nova?.points || 0
  };

  // Create completed game record
  const completedGame: ICompletedGame = {
    sessionId: sessionId,
    cosmicSong: {
      id: session.cosmicSong.id,
      name: session.cosmicSong.name,
      artists: session.cosmicSong.artists
    },
    totalPoints: session.totalPoints || 0,
    roomPoints,
    finalGuessAttempts: session.finalGuessAttempts || 0,
    ophiuchusIdentity: session.ophiuchusIdentity || {
      title: 'Unknown',
      description: '',
      imageUrl: ''
    },
    completedAt: new Date()
  };

  console.log('[completeGameSession] Completed game record:', completedGame);

  // Update or create user profile
  const userProfile = await UserProfile.findOneAndUpdate(
    { userId: session.userId },
    {
      $set: {
        spotifyUserId: session.spotifyUserId,
        username: session.userId, // Could be enhanced with actual username
        lastPlayedAt: new Date()
      },
      $inc: {
        totalGamesPlayed: 1
      },
      $push: {
        completedGames: completedGame
      }
    },
    {
      upsert: true,
      new: true
    }
  );

  // Recalculate total points from all completed games
  const allCompletedGames = userProfile?.completedGames || [];
  const totalPointsSum = allCompletedGames.reduce((sum: number, game: any) => sum + (game.totalPoints || 0), 0);
  
  console.log('[completeGameSession] Calculated total points from', allCompletedGames.length, 'games:', totalPointsSum);
  
  // Update the total points with the calculated sum
  await UserProfile.findOneAndUpdate(
    { userId: session.userId },
    { $set: { totalPoints: totalPointsSum } }
  );

  console.log('[completeGameSession] User profile updated:', userProfile?._id, 'Total points:', totalPointsSum);

  // Update leaderboard with the same calculated sum
  const leaderboardEntry = await Leaderboard.findOneAndUpdate(
    { userId: session.userId },
    {
      $set: {
        username: session.userId,
        spotifyUserId: session.spotifyUserId,
        lastPlayedAt: new Date(),
        totalPoints: totalPointsSum // Use calculated sum instead of incrementing
      },
      $inc: {
        totalGamesCompleted: 1
      },
      $max: {
        highestSingleGamePoints: completedGame.totalPoints
      }
    },
    {
      upsert: true,
      new: true
    }
  );

  console.log('[completeGameSession] Leaderboard updated:', leaderboardEntry?._id, 'Total points:', totalPointsSum);

  // DON'T delete the game session - keep it for display purposes
  // Session will be cleaned up later or on new game start
  console.log('[completeGameSession] Game session kept for summary display:', sessionId);
}

export async function getLeaderboard(limit: number = 10) {
  console.log('[getLeaderboard] Fetching top', limit, 'players');
  await connectDB();

  const leaderboard = await Leaderboard.find()
    .sort({ totalPoints: -1 })
    .limit(limit)
    .lean();

  console.log('[getLeaderboard] Found', leaderboard.length, 'entries');
  return leaderboard;
}

export async function getUserProfile(userId: string) {
  console.log('[getUserProfile] Fetching profile for user:', userId);
  await connectDB();

  const profile = await UserProfile.findOne({ userId }).lean();
  console.log('[getUserProfile] Profile found:', !!profile);
  return profile;
}
