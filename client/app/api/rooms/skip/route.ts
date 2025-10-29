import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GameSession from '@/lib/models/GameSession';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, roomId } = await request.json();

    console.log('[Skip Room API] Request:', { sessionId, roomId });

    if (!sessionId || !roomId) {
      return NextResponse.json(
        { error: 'Missing sessionId or roomId' },
        { status: 400 }
      );
    }

    // Validate roomId
    const validRooms = ['nebula', 'cradle', 'comet', 'aurora'];
    if (!validRooms.includes(roomId)) {
      return NextResponse.json(
        { error: 'Invalid roomId' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the game session
    const gameSession = await GameSession.findById(sessionId);
    
    if (!gameSession) {
      return NextResponse.json(
        { error: 'Game session not found' },
        { status: 404 }
      );
    }

    // Check if session is already completed
    if (gameSession.completed) {
      return NextResponse.json(
        { error: 'Game session already completed' },
        { status: 400 }
      );
    }

    // Initialize roomClues if it doesn't exist
    if (!gameSession.roomClues) {
      gameSession.roomClues = {};
    }

    // Mark room as completed with 0 points (skipped)
    gameSession.roomClues[roomId] = {
      clue: 'Room skipped',
      points: 0,
      completed: true,
      attempts: 0,
      timestamp: new Date(),
    };

    // Save the session
    await gameSession.save();

    console.log('[Skip Room API] Room skipped:', roomId);

    return NextResponse.json({
      success: true,
      roomId,
      message: 'Room skipped successfully',
    });

  } catch (error) {
    console.error('[Skip Room API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
