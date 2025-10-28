import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession, updateRoomCompletion } from '@/functions/gameState';
import { checkArtistGuess, generateArtistReward } from '@/functions/roomLogic/cradle';

export async function POST(request: NextRequest) {
  try {
    console.log('[POST /api/rooms/cradle/guess] Processing artist guess');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, guess } = body;

    if (!sessionId || !guess) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    const artistName = gameSession.cosmicSong.artists[0];
    const isCorrect = checkArtistGuess(guess, artistName);

    console.log('[POST /api/rooms/cradle/guess] Guess result:', isCorrect);

    let rewardClue = '';
    if (isCorrect) {
      rewardClue = await generateArtistReward(gameSession.cosmicSong);
    }

    // Update game state
    await updateRoomCompletion(sessionId, 'cradle', {
      clue: rewardClue,
      correct: isCorrect,
      completed: true
    });

    console.log('[POST /api/rooms/cradle/guess] Room completed');

    return NextResponse.json({
      success: true,
      correct: isCorrect,
      rewardClue,
      correctArtist: isCorrect ? artistName : null
    });

  } catch (error) {
    console.error('[POST /api/rooms/cradle/guess] Error:', error);
    return NextResponse.json({ error: 'Failed to process guess' }, { status: 500 });
  }
}
