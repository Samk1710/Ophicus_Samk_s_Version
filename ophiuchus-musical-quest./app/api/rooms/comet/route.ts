import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession, updateRoomCompletion } from '@/functions/gameState';
import { generateCometLyric, checkCometGuess, generateCometReward } from '@/functions/roomLogic/comet';

export async function GET(request: NextRequest) {
  try {
    console.log('[GET /api/rooms/comet] Getting lyric flash');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    // Check if already completed
    if (gameSession.roomClues?.comet?.completed) {
      return NextResponse.json({
        success: true,
        completed: true
      });
    }

    // Generate lyric from second intermediary song (or first if only one)
    const songIndex = gameSession.intermediarySongs.length > 1 ? 1 : 0;
    const intermediarySong = gameSession.intermediarySongs[songIndex];
    const lyricFlash = await generateCometLyric(intermediarySong);

    console.log('[GET /api/rooms/comet] Lyric flash generated');

    return NextResponse.json({
      success: true,
      lyric: lyricFlash.lyric,
      duration: lyricFlash.duration
    });

  } catch (error) {
    console.error('[GET /api/rooms/comet] Error:', error);
    return NextResponse.json({ error: 'Failed to generate lyric' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[POST /api/rooms/comet] Processing lyric guess');

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

    const songIndex = gameSession.intermediarySongs.length > 1 ? 1 : 0;
    const intermediarySong = gameSession.intermediarySongs[songIndex];
    const isCorrect = checkCometGuess(guess, intermediarySong);

    console.log('[POST /api/rooms/comet] Guess result:', isCorrect);

    let rewardClue = '';
    if (isCorrect) {
      rewardClue = await generateCometReward(gameSession.cosmicSong);
    }

    await updateRoomCompletion(sessionId, 'comet', {
      clue: rewardClue,
      correct: isCorrect,
      completed: true
    });

    console.log('[POST /api/rooms/comet] Room completed');

    return NextResponse.json({
      success: true,
      correct: isCorrect,
      rewardClue,
      correctSong: isCorrect ? {
        name: intermediarySong.name,
        artists: intermediarySong.artists
      } : null
    });

  } catch (error) {
    console.error('[POST /api/rooms/comet] Error:', error);
    return NextResponse.json({ error: 'Failed to process guess' }, { status: 500 });
  }
}
