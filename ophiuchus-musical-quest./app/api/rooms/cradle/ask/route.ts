import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession } from '@/functions/gameState';
import { answerArtistQuestion } from '@/functions/roomLogic/cradle';

export async function POST(request: NextRequest) {
  try {
    console.log('[POST /api/rooms/cradle/ask] Answering artist question');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, question } = body;

    if (!sessionId || !question) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    const artistName = gameSession.cosmicSong.artists[0];
    const answer = await answerArtistQuestion(question, artistName);

    console.log('[POST /api/rooms/cradle/ask] Answer generated');

    return NextResponse.json({
      success: true,
      answer
    });

  } catch (error) {
    console.error('[POST /api/rooms/cradle/ask] Error:', error);
    return NextResponse.json({ error: 'Failed to answer question' }, { status: 500 });
  }
}
