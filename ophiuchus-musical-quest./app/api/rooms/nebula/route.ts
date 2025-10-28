import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession, updateRoomCompletion } from '@/functions/gameState';
import {
  generateNebulaRiddle,
  generateNebulaReward,
  generateNebulaPenalty,
  checkNebulaGuess
} from '@/functions/roomLogic/nebula';

export async function GET(request: NextRequest) {
  console.log('\n' + '🌫️  NEBULA ROOM - GET RIDDLE'.padEnd(80, ' '));
  console.log('─'.repeat(80));
  
  try {
    console.log('📡 [GET /api/rooms/nebula] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('❌ [GET /api/rooms/nebula] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ [GET /api/rooms/nebula] User authenticated:', session.user.username);

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      console.error('❌ [GET /api/rooms/nebula] Missing sessionId');
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }
    console.log('🎯 [GET /api/rooms/nebula] Session ID:', sessionId);

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      console.error('❌ [GET /api/rooms/nebula] Game session not found');
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }
    console.log('✅ [GET /api/rooms/nebula] Game session found');

    // Check if already completed
    if (gameSession.roomClues?.nebula?.completed) {
      console.log('ℹ️  [GET /api/rooms/nebula] Room already completed, returning existing clue');
      console.log('─'.repeat(80) + '\n');
      return NextResponse.json({
        success: true,
        riddle: gameSession.roomClues.nebula.clue,
        completed: true,
        clue: gameSession.roomClues.nebula.clue
      });
    }

    // Generate riddle from first intermediary song
    const intermediarySong = gameSession.intermediarySongs[0];
    console.log('🎵 [GET /api/rooms/nebula] Intermediary song:', {
      name: intermediarySong.name,
      artists: intermediarySong.artists
    });
    
    console.log('🤖 [GET /api/rooms/nebula] Generating riddle with AI...');
    const startTime = Date.now();
    const riddle = await generateNebulaRiddle(intermediarySong);
    const genTime = Date.now() - startTime;

    console.log(`✅ [GET /api/rooms/nebula] Riddle generated in ${genTime}ms`);
    console.log('📜 [GET /api/rooms/nebula] Riddle preview:', riddle.substring(0, 100) + '...');
    console.log('─'.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      riddle,
      attempts: gameSession.roomClues?.nebula?.attempts || 0
    });

  } catch (error) {
    console.error('💥 [GET /api/rooms/nebula] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('─'.repeat(80) + '\n');
    return NextResponse.json({ error: 'Failed to generate riddle' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('\n' + '🌫️  NEBULA ROOM - SUBMIT GUESS'.padEnd(80, ' '));
  console.log('─'.repeat(80));
  
  try {
    console.log('📡 [POST /api/rooms/nebula] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('❌ [POST /api/rooms/nebula] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ [POST /api/rooms/nebula] User authenticated:', session.user.username);

    const body = await request.json();
    const { sessionId, guessedTrackId } = body;
    console.log('📥 [POST /api/rooms/nebula] Request body:', { sessionId, guessedTrackId });

    if (!sessionId || !guessedTrackId) {
      console.error('❌ [POST /api/rooms/nebula] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      console.error('❌ [POST /api/rooms/nebula] Game session not found');
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    const intermediarySong = gameSession.intermediarySongs[0];
    console.log('🎯 [POST /api/rooms/nebula] Correct song:', {
      id: intermediarySong.id,
      name: intermediarySong.name
    });
    console.log('🤔 [POST /api/rooms/nebula] User guessed ID:', guessedTrackId);
    
    const isCorrect = checkNebulaGuess(guessedTrackId, intermediarySong);
    const currentAttempts = (gameSession.roomClues?.nebula?.attempts || 0) + 1;
    
    console.log(isCorrect ? '✅ [POST /api/rooms/nebula] CORRECT!' : '❌ [POST /api/rooms/nebula] INCORRECT');
    console.log(`📊 [POST /api/rooms/nebula] Attempt ${currentAttempts}/3`);

    let rewardClue = '';
    let points = 0;
    
    // Points system: 100 for first try, 50 for second, 25 for third
    if (isCorrect) {
      if (currentAttempts === 1) points = 100;
      else if (currentAttempts === 2) points = 50;
      else points = 25;
      
      console.log(`🎁 [POST /api/rooms/nebula] CORRECT on attempt ${currentAttempts}! Points: ${points}`);
      console.log('🎁 [POST /api/rooms/nebula] Generating reward clue...');
      const startTime = Date.now();
      rewardClue = await generateNebulaReward(gameSession.cosmicSong);
      console.log(`✅ [POST /api/rooms/nebula] Reward generated in ${Date.now() - startTime}ms`);
      console.log('📜 [POST /api/rooms/nebula] Reward clue:', rewardClue.substring(0, 100) + '...');
    } else if (currentAttempts >= 3) {
      points = 0;
      console.log('⚠️  [POST /api/rooms/nebula] Failed all 3 attempts, no points awarded');
      console.log('⚠️  [POST /api/rooms/nebula] Generating penalty clue...');
      const startTime = Date.now();
      rewardClue = await generateNebulaPenalty(gameSession.cosmicSong);
      console.log(`✅ [POST /api/rooms/nebula] Penalty generated in ${Date.now() - startTime}ms`);
      console.log('📜 [POST /api/rooms/nebula] Penalty clue (misleading):', rewardClue.substring(0, 100) + '...');
    }

    const shouldReveal = isCorrect || currentAttempts >= 3;
    console.log(`🎭 [POST /api/rooms/nebula] Reveal nebula song: ${shouldReveal}`);

    // Update game state
    console.log('💾 [POST /api/rooms/nebula] Updating game state...');
    await updateRoomCompletion(sessionId, 'nebula', {
      clue: rewardClue,
      correct: isCorrect,
      attempts: currentAttempts,
      completed: shouldReveal,
      points: points,
      revealedSong: shouldReveal ? intermediarySong : undefined
    });
    console.log('✅ [POST /api/rooms/nebula] Game state updated');

    console.log('─'.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      correct: isCorrect,
      clue: rewardClue,
      points: points,
      attemptsRemaining: 3 - currentAttempts,
      completed: shouldReveal,
      celebrateCorrect: isCorrect, // Trigger confetti on correct answer
      revealedSong: shouldReveal ? {
        id: intermediarySong.id,
        name: intermediarySong.name,
        artists: intermediarySong.artists,
        album: intermediarySong.album,
        imageUrl: intermediarySong.imageUrl
      } : null
    });

  } catch (error) {
    console.error('💥 [POST /api/rooms/nebula] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('─'.repeat(80) + '\n');
    return NextResponse.json({ error: 'Failed to process guess' }, { status: 500 });
  }
}
