import GameSession, { IGameSession, ISong } from '@/lib/models/GameSession';
import connectDB from '@/lib/mongodb';

export async function createGameSession(
  userId: string,
  spotifyUserId: string,
  cosmicSong: ISong,
  intermediarySongs: ISong[],
  initialClue: string
): Promise<IGameSession> {
  console.log('[createGameSession] Creating new game session for user:', userId);
  await connectDB();

  const session = await GameSession.create({
    userId,
    spotifyUserId,
    cosmicSong,
    intermediarySongs,
    initialClue,
    roomsCompleted: [],
  roomClues: {},
  roomsCompletedMap: {},
    finalGuesses: 0,
    completed: false
  });

  console.log('[createGameSession] Game session created:', session._id);
  return session;
}

export async function getGameSession(sessionId: string): Promise<IGameSession | null> {
  console.log('[getGameSession] Fetching session:', sessionId);
  await connectDB();
  
  const session = await GameSession.findById(sessionId);
  console.log('[getGameSession] Session found:', !!session);
  return session;
}

export async function getLatestGameSession(userId: string): Promise<IGameSession | null> {
  console.log('[getLatestGameSession] Fetching latest session for user:', userId);
  await connectDB();
  
  const session = await GameSession.findOne({ userId })
    .sort({ createdAt: -1 })
    .exec();
  
  console.log('[getLatestGameSession] Session found:', !!session);
  return session;
}

export async function updateRoomCompletion(
  sessionId: string,
  roomName: string,
  roomClue: any
): Promise<IGameSession | null> {
  console.log('[updateRoomCompletion] Updating room:', roomName, 'for session:', sessionId);
  await connectDB();

  // Keep legacy roomsCompleted array for compatibility, and also set the per-room map entry to 'pending' by default
  const update: any = {
    $addToSet: { roomsCompleted: roomName },
    $set: {
      [`roomClues.${roomName}`]: roomClue,
      // Ensure the room exists in the roomsCompletedMap with at least 'pending' status
      [`roomsCompletedMap.${roomName}`]: 'pending'
    }
  };

  const session = await GameSession.findByIdAndUpdate(
    sessionId,
    update,
    { new: true }
  );

  console.log('[updateRoomCompletion] Room updated successfully');
  return session;
}

// Mark the final status for a room: 'correct' or 'wrong'
export async function markRoomFinalStatus(
  sessionId: string,
  roomName: string,
  status: 'correct' | 'wrong'
): Promise<IGameSession | null> {
  console.log('[markRoomFinalStatus] Marking room final status:', roomName, status, 'for session:', sessionId);
  await connectDB();

  const update: any = {
    $set: {
      [`roomsCompletedMap.${roomName}`]: status
    }
  };

  const session = await GameSession.findByIdAndUpdate(sessionId, update, { new: true });
  return session;
}

export async function submitFinalGuess(
  sessionId: string,
  guessedTrackId: string
): Promise<{ correct: boolean; session: IGameSession | null }> {
  console.log('[submitFinalGuess] Processing final guess for session:', sessionId);
  console.log('[submitFinalGuess] Guessed Track ID:', guessedTrackId);
  await connectDB();

  const session = await GameSession.findById(sessionId);
  if (!session) {
    console.log('[submitFinalGuess] Session not found');
    return { correct: false, session: null };
  }

  console.log('[submitFinalGuess] Cosmic Song ID:', session.cosmicSong?.id);
  console.log('[submitFinalGuess] Cosmic Song Name:', session.cosmicSong?.name);
  console.log('[submitFinalGuess] Guessed Track ID:', guessedTrackId);
  console.log('[submitFinalGuess] ID Match:', guessedTrackId === session.cosmicSong?.id);
  console.log('[submitFinalGuess] ID Type - Guessed:', typeof guessedTrackId);
  console.log('[submitFinalGuess] ID Type - Cosmic:', typeof session.cosmicSong?.id);
  
  // Ensure cosmicSong and its ID exist
  if (!session.cosmicSong || !session.cosmicSong.id) {
    console.error('[submitFinalGuess] Cosmic song not found in session');
    return { correct: false, session };
  }
  
  // Compare track IDs directly (both should be strings)
  const correct = String(guessedTrackId).trim() === String(session.cosmicSong.id).trim();
  
  // Increment attempts but cap at 3 maximum
  session.finalGuessAttempts = Math.min((session.finalGuessAttempts || 0) + 1, 3);
  
  if (correct) {
    session.completed = true;
    console.log('[submitFinalGuess] ✅ CORRECT! Track IDs match');
  } else {
    console.log('[submitFinalGuess] ❌ INCORRECT! IDs do not match');
    console.log('[submitFinalGuess] Expected (trimmed):', String(session.cosmicSong.id).trim());
    console.log('[submitFinalGuess] Got (trimmed):', String(guessedTrackId).trim());
    console.log('[submitFinalGuess] Attempts:', session.finalGuessAttempts);
  }

  await session.save();
  
  return { correct, session };
}

export async function setOphiuchusIdentity(
  sessionId: string,
  identity: { title: string; description: string; imageUrl: string }
): Promise<IGameSession | null> {
  console.log('[setOphiuchusIdentity] Setting identity for session:', sessionId);
  await connectDB();

  const session = await GameSession.findByIdAndUpdate(
    sessionId,
    { $set: { ophiuchusIdentity: identity } },
    { new: true }
  );

  console.log('[setOphiuchusIdentity] Identity set successfully');
  return session;
}

function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}
