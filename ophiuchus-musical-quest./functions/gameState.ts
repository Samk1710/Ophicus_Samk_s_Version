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

  const update: any = {
    $addToSet: { roomsCompleted: roomName },
    $set: {
      [`roomClues.${roomName}`]: roomClue
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

export async function submitFinalGuess(
  sessionId: string,
  guessedSong: string
): Promise<{ correct: boolean; session: IGameSession | null }> {
  console.log('[submitFinalGuess] Processing final guess for session:', sessionId);
  await connectDB();

  const session = await GameSession.findById(sessionId);
  if (!session) {
    console.log('[submitFinalGuess] Session not found');
    return { correct: false, session: null };
  }

  console.log('[submitFinalGuess] Comparing guess:', guessedSong, 'with cosmic song:', session.cosmicSong.name);
  
  const correct = normalizeString(guessedSong) === normalizeString(session.cosmicSong.name);
  
  session.finalGuesses += 1;
  
  if (correct) {
    session.completed = true;
    console.log('[submitFinalGuess] Correct guess! Game completed');
  } else {
    console.log('[submitFinalGuess] Incorrect guess. Attempts:', session.finalGuesses);
  }

  await session.save();
  
  return { correct, session };
}

export async function setOphiuchusIdentity(
  sessionId: string,
  identity: string
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
