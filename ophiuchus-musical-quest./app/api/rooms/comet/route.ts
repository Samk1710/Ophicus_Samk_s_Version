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
  console.log('\n' + '☄️  COMET ROOM - SUBMIT GUESS (ONE CHANCE)'.padEnd(80, ' '));
  console.log('─'.repeat(80));
  
  try {
    console.log('📡 [POST /api/rooms/comet] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('❌ [POST /api/rooms/comet] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ [POST /api/rooms/comet] User authenticated:', session.user.username);

    const body = await request.json();
    const { sessionId, guessedTrackId } = body;
    console.log('📥 [POST /api/rooms/comet] Request body:', { sessionId, guessedTrackId });

    if (!sessionId || !guessedTrackId) {
      console.error('❌ [POST /api/rooms/comet] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      console.error('❌ [POST /api/rooms/comet] Game session not found');
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    const songIndex = gameSession.intermediarySongs.length > 1 ? 1 : 0;
    const intermediarySong = gameSession.intermediarySongs[songIndex];
    console.log('🎯 [POST /api/rooms/comet] Comet song:', {
      id: intermediarySong.id,
      name: intermediarySong.name
    });
    console.log('🤔 [POST /api/rooms/comet] User guessed ID:', guessedTrackId);
    
    const isCorrect = checkCometGuess(guessedTrackId, intermediarySong);
    console.log(isCorrect ? '✅ [POST /api/rooms/comet] CORRECT!' : '❌ [POST /api/rooms/comet] INCORRECT');

    // Points: 100 if correct, 0 if wrong (only one chance)
    const points = isCorrect ? 100 : 0;
    console.log(`🎁 [POST /api/rooms/comet] Points awarded: ${points}`);

    let rewardClue = '';
    if (isCorrect) {
      console.log('🎁 [POST /api/rooms/comet] Generating reward clue...');
      const startTime = Date.now();
      rewardClue = await generateCometReward(gameSession.cosmicSong);
      console.log(`✅ [POST /api/rooms/comet] Reward generated in ${Date.now() - startTime}ms`);
    } else {
      console.log('⚠️  [POST /api/rooms/comet] Wrong answer - no clue given');
      rewardClue = "The comet has passed, and its secret remains hidden in the cosmic void.";
    }

    console.log('🎭 [POST /api/rooms/comet] ALWAYS REVEALING COMET SONG (one chance only)');
    
    // Update game state - always completed after one attempt
    console.log('💾 [POST /api/rooms/comet] Updating game state...');
    await updateRoomCompletion(sessionId, 'comet', {
      clue: rewardClue,
      correct: isCorrect,
      attempts: 1,
      completed: true,
      points: points,
      revealedSong: intermediarySong  // Always reveal
    });
    console.log('✅ [POST /api/rooms/comet] Game state updated');
    console.log('─'.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      correct: isCorrect,
      clue: rewardClue,
      points: points,
      completed: true,
      celebrateCorrect: isCorrect, // Trigger confetti on correct answer
      revealedSong: {
        id: intermediarySong.id,
        name: intermediarySong.name,
        artists: intermediarySong.artists,
        album: intermediarySong.album,
        imageUrl: intermediarySong.imageUrl
      }
    });

  } catch (error) {
    console.error('💥 [POST /api/rooms/comet] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('─'.repeat(80) + '\n');
    return NextResponse.json({ error: 'Failed to process guess' }, { status: 500 });
  }
}
