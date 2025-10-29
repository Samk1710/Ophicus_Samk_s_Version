import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession } from '@/functions/gameState';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    console.log('[GET /api/game/[sessionId]] Fetching game session:', sessionId);

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('[GET /api/game/[sessionId]] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gameSession = await getGameSession(sessionId);
    
    if (!gameSession) {
      console.log('[GET /api/game/[sessionId]] Session not found');
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    // Verify ownership
    if (gameSession.userId !== session.user.username) {
      console.log('[GET /api/game/[sessionId]] Forbidden - not owner');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('[GET /api/game/[sessionId]] Session retrieved successfully');

    return NextResponse.json({
      success: true,
      session: {
        id: (gameSession as any)._id.toString(),
        initialClue: gameSession.initialClue,
        roomsCompleted: gameSession.roomsCompleted,
        roomClues: gameSession.roomClues,
        finalGuessAttempts: gameSession.finalGuessAttempts,
        completed: gameSession.completed,
        ophiuchusIdentity: gameSession.ophiuchusIdentity,
        totalPoints: gameSession.totalPoints,
        // Don't expose the cosmic song until game is complete
        cosmicSong: gameSession.completed ? gameSession.cosmicSong : null
      }
    });

  } catch (error) {
    console.error('[GET /api/game/[sessionId]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game session' },
      { status: 500 }
    );
  }
}
