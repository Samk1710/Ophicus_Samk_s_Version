import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession, updateRoomCompletion } from '@/functions/gameState';
import { 
  generateAuroraEmotionalSituation, 
  scoreAuroraSongMatch,
  generateAuroraReward
} from '@/functions/roomLogic/aurora';
import spotifyApi from '@/lib/spotify';

export async function GET(request: NextRequest) {
  console.log('\n' + '🌈 AURORA ROOM - GET EMOTIONAL AUDIO'.padEnd(80, ' '));
  console.log('─'.repeat(80));
  
  try {
    console.log('📡 [GET /api/rooms/aurora] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('❌ [GET /api/rooms/aurora] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ [GET /api/rooms/aurora] User authenticated:', session.user.username);

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      console.error('❌ [GET /api/rooms/aurora] Missing sessionId');
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }
    console.log('🎯 [GET /api/rooms/aurora] Session ID:', sessionId);

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      console.error('❌ [GET /api/rooms/aurora] Game session not found');
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }
    console.log('✅ [GET /api/rooms/aurora] Game session found');

    // Check if already completed
    if (gameSession.roomClues?.aurora?.completed) {
      console.log('ℹ️  [GET /api/rooms/aurora] Room already completed, returning existing data');
      console.log('─'.repeat(80) + '\n');
      return NextResponse.json({
        success: true,
        completed: true,
        clue: gameSession.roomClues.aurora.clue,
        audioUrl: gameSession.roomClues.aurora.audioUrl
      });
    }

    // Check if we already generated audio for this session
    if (gameSession.roomClues?.aurora?.audioUrl) {
      console.log('ℹ️  [GET /api/rooms/aurora] Audio already generated, returning cached version');
      console.log('─'.repeat(80) + '\n');
      return NextResponse.json({
        success: true,
        audioUrl: gameSession.roomClues.aurora.audioUrl,
        emotionalSituation: gameSession.roomClues.aurora.emotionalSituation
      });
    }

    // Generate new emotional situation and audio
    console.log('🤖 [GET /api/rooms/aurora] Generating emotional situation and audio...');
    const startTime = Date.now();
    const emotionalData = await generateAuroraEmotionalSituation();
    const genTime = Date.now() - startTime;

    console.log(`✅ [GET /api/rooms/aurora] Emotional audio generated in ${genTime}ms`);
    console.log('🎭 [GET /api/rooms/aurora] Situation:', emotionalData.situation);
    console.log('📜 [GET /api/rooms/aurora] Audio text preview:', emotionalData.audioText.substring(0, 100) + '...');
    console.log('🔊 [GET /api/rooms/aurora] Audio URL:', emotionalData.audioUrl);

    // Store the audio URL and situation in game session
    await updateRoomCompletion(sessionId, 'aurora', {
      audioUrl: emotionalData.audioUrl,
      emotionalSituation: emotionalData.situation,
      attempts: 0
    });
    console.log('💾 [GET /api/rooms/aurora] Audio data saved to session');

    console.log('─'.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      audioUrl: emotionalData.audioUrl,
      // Don't send situation to frontend - player shouldn't know it explicitly
    });

  } catch (error) {
    console.error('💥 [GET /api/rooms/aurora] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('─'.repeat(80) + '\n');
    return NextResponse.json({ error: 'Failed to generate emotional audio' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('\n' + '🌈 AURORA ROOM - SUBMIT SONG SUGGESTION'.padEnd(80, ' '));
  console.log('─'.repeat(80));
  
  try {
    console.log('📡 [POST /api/rooms/aurora] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('❌ [POST /api/rooms/aurora] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ [POST /api/rooms/aurora] User authenticated:', session.user.username);

    const body = await request.json();
    const { sessionId, guessedTrackId } = body;
    console.log('📥 [POST /api/rooms/aurora] Request body:', { sessionId, guessedTrackId });

    if (!sessionId || !guessedTrackId) {
      console.error('❌ [POST /api/rooms/aurora] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      console.error('❌ [POST /api/rooms/aurora] Game session not found');
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    // Get emotional situation from stored data
    const emotionalSituation = gameSession.roomClues?.aurora?.emotionalSituation;
    const audioText = ''; // We don't store the full audio text, but we have the situation

    if (!emotionalSituation) {
      console.error('❌ [POST /api/rooms/aurora] No emotional situation found');
      return NextResponse.json({ error: 'Audio must be generated first' }, { status: 400 });
    }

    console.log('🎭 [POST /api/rooms/aurora] Emotional situation:', emotionalSituation);

    // Fetch the guessed song details from Spotify
    spotifyApi.setAccessToken(session.user.accessToken!);
    console.log('🎵 [POST /api/rooms/aurora] Fetching song details from Spotify...');
    const trackData = await spotifyApi.getTrack(guessedTrackId);
    const guessedSong = {
      id: trackData.body.id,
      name: trackData.body.name,
      artists: trackData.body.artists.map((a: any) => a.name),
      album: trackData.body.album.name,
      imageUrl: trackData.body.album.images[0]?.url || ''
    };
    console.log('✅ [POST /api/rooms/aurora] Song details:', guessedSong.name, 'by', guessedSong.artists.join(', '));

    // Score the song suggestion
    console.log('🤖 [POST /api/rooms/aurora] Scoring song relevance with AI...');
    const startTime = Date.now();
    const { score, feedback } = await scoreAuroraSongMatch(guessedSong, emotionalSituation, emotionalSituation);
    const scoreTime = Date.now() - startTime;

    console.log(`✅ [POST /api/rooms/aurora] Scoring completed in ${scoreTime}ms`);
    console.log(`🎯 [POST /api/rooms/aurora] Score: ${score}/10`);
    console.log(`💬 [POST /api/rooms/aurora] Feedback: ${feedback}`);

    // Points based on score: 0-10 scale directly translates to points
    // 9-10: 100 points, 7-8: 75 points, 5-6: 50 points, 3-4: 25 points, 0-2: 0 points
    let points = 0;
    if (score >= 9) points = 100;
    else if (score >= 7) points = 75;
    else if (score >= 5) points = 50;
    else if (score >= 3) points = 25;
    
    console.log(`🎁 [POST /api/rooms/aurora] Points awarded: ${points}`);

    const passed = score >= 7;
    console.log(passed ? '✅ [POST /api/rooms/aurora] PASSED (score >= 7)' : '❌ [POST /api/rooms/aurora] FAILED (score < 7)');

    let rewardClue = '';
    if (passed) {
      console.log('🎁 [POST /api/rooms/aurora] Generating reward clue...');
      const clueStart = Date.now();
      rewardClue = await generateAuroraReward(gameSession.cosmicSong, score);
      console.log(`✅ [POST /api/rooms/aurora] Clue generated in ${Date.now() - clueStart}ms`);
      console.log('📜 [POST /api/rooms/aurora] Clue preview:', rewardClue.substring(0, 100) + '...');
    }

    const currentAttempts = (gameSession.roomClues?.aurora?.attempts || 0) + 1;
    console.log(`📊 [POST /api/rooms/aurora] Attempt ${currentAttempts}`);

    // Update game state
    console.log('💾 [POST /api/rooms/aurora] Updating game state...');
    await updateRoomCompletion(sessionId, 'aurora', {
      clue: rewardClue,
      score: score,
      attempts: currentAttempts,
      completed: passed,
      points: points
    });
    console.log('✅ [POST /api/rooms/aurora] Game state updated');

    console.log('─'.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      passed,
      score,
      feedback,
      points,
      clue: rewardClue,
      attemptsRemaining: passed ? 0 : Math.max(0, 3 - currentAttempts)
    });

  } catch (error) {
    console.error('💥 [POST /api/rooms/aurora] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('─'.repeat(80) + '\n');
    return NextResponse.json({ error: 'Failed to process song suggestion' }, { status: 500 });
  }
}
