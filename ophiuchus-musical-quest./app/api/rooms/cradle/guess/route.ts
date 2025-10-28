import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession, updateRoomCompletion } from '@/functions/gameState';
import { checkArtistGuess, generateArtistReward } from '@/functions/roomLogic/cradle';
import spotifyApi from '@/lib/spotify';

export async function POST(request: NextRequest) {
  console.log('\n' + '🌍 CRADLE ROOM - ARTIST GUESS'.padEnd(80, ' '));
  console.log('─'.repeat(80));
  
  try {
    console.log('📡 [POST /api/rooms/cradle/guess] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('❌ [POST /api/rooms/cradle/guess] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ [POST /api/rooms/cradle/guess] User authenticated:', session.user.username);

    const body = await request.json();
    const { sessionId, guessedArtistId } = body;
    console.log('📥 [POST /api/rooms/cradle/guess] Request body:', { sessionId, guessedArtistId });

    if (!sessionId || !guessedArtistId) {
      console.error('❌ [POST /api/rooms/cradle/guess] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      console.error('❌ [POST /api/rooms/cradle/guess] Game session not found');
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    // Get current attempts
    const currentAttempts = (gameSession.roomClues?.cradle?.attempts || 0) + 1;
    console.log(`📊 [POST /api/rooms/cradle/guess] Attempt ${currentAttempts}/3`);

    if (currentAttempts > 3) {
      console.error('❌ [POST /api/rooms/cradle/guess] Maximum attempts exceeded');
      return NextResponse.json({ error: 'Maximum attempts exceeded' }, { status: 400 });
    }

    // Fetch artist details from Spotify
    spotifyApi.setAccessToken(session.user.accessToken!);
    console.log('🎵 [POST /api/rooms/cradle/guess] Fetching artist details from Spotify...');
    const artistData = await spotifyApi.getArtist(guessedArtistId);
    const guessedArtistName = artistData.body.name;
    console.log('✅ [POST /api/rooms/cradle/guess] Guessed artist:', guessedArtistName);

    const correctArtistName = gameSession.cosmicSong.artists[0];
    const isCorrect = checkArtistGuess(guessedArtistName, correctArtistName);
    console.log(isCorrect ? '✅ [POST /api/rooms/cradle/guess] CORRECT!' : '❌ [POST /api/rooms/cradle/guess] INCORRECT');
    console.log('🎯 [POST /api/rooms/cradle/guess] Correct artist:', correctArtistName);

    // Calculate points: 100 for 1st attempt, 75 for 2nd, 50 for 3rd
    let points = 0;
    if (isCorrect) {
      if (currentAttempts === 1) points = 100;
      else if (currentAttempts === 2) points = 75;
      else points = 50;
      console.log(`🎁 [POST /api/rooms/cradle/guess] Points awarded: ${points}`);
    }

    let rewardClue = '';
    if (isCorrect) {
      console.log('🎁 [POST /api/rooms/cradle/guess] Generating reward clue...');
      rewardClue = await generateArtistReward(gameSession.cosmicSong);
      console.log('✅ [POST /api/rooms/cradle/guess] Reward clue generated');
    }

    // Update game state
    console.log('💾 [POST /api/rooms/cradle/guess] Updating game state...');
    await updateRoomCompletion(sessionId, 'cradle', {
      clue: rewardClue,
      attempts: currentAttempts,
      completed: isCorrect,
      points: points
    });
    console.log('✅ [POST /api/rooms/cradle/guess] Game state updated');

    console.log('─'.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      correct: isCorrect,
      clue: rewardClue,
      points: points,
      correctArtist: isCorrect ? { name: correctArtistName } : null,
      attemptsRemaining: isCorrect ? 0 : Math.max(0, 3 - currentAttempts),
      celebrateCorrect: isCorrect // Flag for confetti
    });

  } catch (error) {
    console.error('💥 [POST /api/rooms/cradle/guess] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('─'.repeat(80) + '\n');
    return NextResponse.json({ error: 'Failed to process guess' }, { status: 500 });
  }
}
