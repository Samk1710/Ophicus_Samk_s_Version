import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession } from '@/functions/gameState';
import { generateArtistClue } from '@/functions/roomLogic/cradle';

export async function GET(request: NextRequest) {
  try {
    console.log('[GET /api/rooms/cradle] Getting artist clue');

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
    if (gameSession.roomClues?.cradle?.completed) {
      return NextResponse.json({
        success: true,
        artistClue: gameSession.roomClues.cradle.clue,
        completed: true
      });
    }

    // Generate artist identity clue from cosmic song's artist
    const artistName = gameSession.cosmicSong.artists[0];
    const artistClue = await generateArtistClue(artistName);

    console.log('[GET /api/rooms/cradle] Artist clue generated');

    return NextResponse.json({
      success: true,
      artistClue
    });

  } catch (error) {
    console.error('[GET /api/rooms/cradle] Error:', error);
    return NextResponse.json({ error: 'Failed to generate artist clue' }, { status: 500 });
  }
}
