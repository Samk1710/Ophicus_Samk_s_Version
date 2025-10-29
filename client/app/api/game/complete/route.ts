import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { completeGameSession } from '@/functions/leaderboard';
import GameSession from '@/lib/models/GameSession';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Mark completed and archive
    const game = await GameSession.findById(sessionId);
    if (!game) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    game.completed = true;
    await game.save();

    await completeGameSession(sessionId);

    try {
      await GameSession.findByIdAndDelete(sessionId);
    } catch (err) {
      console.error('[POST /api/game/complete] Failed to delete session after archiving', err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/game/complete] Error', error);
    return NextResponse.json({ error: 'Failed to complete session' }, { status: 500 });
  }
}
