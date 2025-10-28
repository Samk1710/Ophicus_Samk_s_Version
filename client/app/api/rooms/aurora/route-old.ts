import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession, updateRoomCompletion } from '@/functions/gameState';
import { generateAuroraVignette, scoreAuroraMatch, generateAuroraReward } from '@/functions/roomLogic/aurora';
import { ISong } from '@/lib/models/GameSession';

export async function GET(request: NextRequest) {
  try {
    console.log('[GET /api/rooms/aurora] Generating emotional vignette');

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
    if (gameSession.roomClues?.aurora?.completed) {
      return NextResponse.json({
        success: true,
        audioId: gameSession.roomClues.aurora.audioUrl,
        completed: true
      });
    }

    // Generate emotional vignette based on cosmic song
    const vignette = await generateAuroraVignette(gameSession.cosmicSong);

    console.log('[GET /api/rooms/aurora] Vignette generated with audio ID:', vignette.audioId);

    // Store emotion temporarily (we'll need it for scoring)
    // In a real app, you might store this in Redis or a temporary field

    return NextResponse.json({
      success: true,
      text: vignette.text,
      audioId: vignette.audioId,
      emotion: vignette.emotion // Hidden from UI, used for scoring
    });

  } catch (error) {
    console.error('[GET /api/rooms/aurora] Error:', error);
    return NextResponse.json({ error: 'Failed to generate vignette' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[POST /api/rooms/aurora] Processing emotional match');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, guessedSong, targetEmotion } = body;

    if (!sessionId || !guessedSong) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    const guessedSongObj: ISong = {
      id: guessedSong.id,
      name: guessedSong.name,
      artists: guessedSong.artists,
      album: guessedSong.album || '',
      imageUrl: guessedSong.imageUrl || ''
    };

    const score = await scoreAuroraMatch(
      guessedSongObj,
      gameSession.cosmicSong,
      targetEmotion
    );

    console.log('[POST /api/rooms/aurora] Match score:', score);

    let rewardClue = '';
    if (score >= 7) {
      rewardClue = await generateAuroraReward(gameSession.cosmicSong, score);
    }

    await updateRoomCompletion(sessionId, 'aurora', {
      clue: rewardClue,
      score,
      completed: true
    });

    console.log('[POST /api/rooms/aurora] Room completed');

    return NextResponse.json({
      success: true,
      score,
      rewardClue
    });

  } catch (error) {
    console.error('[POST /api/rooms/aurora] Error:', error);
    return NextResponse.json({ error: 'Failed to process match' }, { status: 500 });
  }
}
