import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { submitFinalGuess, setOphiuchusIdentity } from '@/functions/gameState';
import { generateOphiuchusIdentity } from '@/functions/bigbang';

export async function POST(request: NextRequest) {
  console.log('\n' + '🎯 FINAL GUESS - COSMIC SONG REVELATION'.padEnd(80, '='));
  console.log('='.repeat(80));
  
  try {
    console.log('📡 [POST /api/final-guess] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('❌ [POST /api/final-guess] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ [POST /api/final-guess] User authenticated:', session.user.username);

    const body = await request.json();
    const { sessionId, guessedTrackId } = body;
    console.log('📥 [POST /api/final-guess] Request:', { sessionId, guessedTrackId });

    if (!sessionId || !guessedTrackId) {
      console.error('❌ [POST /api/final-guess] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('🎲 [POST /api/final-guess] Submitting guess...');
    const result = await submitFinalGuess(sessionId, guessedTrackId);

    if (!result.session) {
      console.error('❌ [POST /api/final-guess] Session not found');
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    console.log('🎯 [POST /api/final-guess] Cosmic Song:', {
      id: result.session.cosmicSong?.id,
      name: result.session.cosmicSong?.name,
      artists: result.session.cosmicSong?.artists
    });
    console.log('🤔 [POST /api/final-guess] User guessed ID:', guessedTrackId);
    console.log(result.correct ? '🎉 CORRECT!' : '❌ INCORRECT');
    console.log(`📊 [POST /api/final-guess] Attempts used: ${result.session.finalGuessAttempts}/2`);

    if (result.correct) {
      console.log('🌟 [POST /api/final-guess] Generating Ophiuchus identity...');
      
      const musicProfile = `User has completed ${result.session.roomsCompleted.length} cosmic chambers. Their journey led them to discover their cosmic song: "${result.session.cosmicSong.name}" by ${result.session.cosmicSong.artists.join(', ')}.`;
      console.log('📝 [POST /api/final-guess] Music profile:', musicProfile);
      
      const startTime = Date.now();
      const identity = await generateOphiuchusIdentity(
        result.session.cosmicSong,
        musicProfile
      );
      const genTime = Date.now() - startTime;

      console.log(`✅ [POST /api/final-guess] Ophiuchus identity generated in ${genTime}ms`);
      
      // Parse identity if it's a string
      const parsedIdentity = typeof identity === 'string' ? JSON.parse(identity) : identity;
      console.log('👑 [POST /api/final-guess] Title:', parsedIdentity.title);
      console.log('📜 [POST /api/final-guess] Description:', parsedIdentity.description?.substring(0, 100) + '...');
      
      if (parsedIdentity.imageUrl) {
        console.log('🖼️  [POST /api/final-guess] Image URL:', parsedIdentity.imageUrl);
      }

      await setOphiuchusIdentity(sessionId, typeof identity === 'string' ? identity : JSON.stringify(identity));
      console.log('💾 [POST /api/final-guess] Identity saved to database');

      console.log('='.repeat(80));
      console.log('🎊 QUEST COMPLETE! User has achieved cosmic enlightenment!');
      console.log('='.repeat(80) + '\n');

      return NextResponse.json({
        success: true,
        correct: true,
        cosmicSong: result.session.cosmicSong,
        ophiuchusIdentity: parsedIdentity,
        attemptsUsed: result.session.finalGuessAttempts
      });
    } else {
      const attemptsRemaining = 2 - result.session.finalGuessAttempts;
      console.log(`⚠️  [POST /api/final-guess] Attempts remaining: ${attemptsRemaining}/2`);
      
      if (attemptsRemaining === 0) {
        console.log('💔 [POST /api/final-guess] GAME OVER - All attempts exhausted');
      }
      
      console.log('='.repeat(80) + '\n');

      return NextResponse.json({
        success: true,
        correct: false,
        attemptsRemaining,
        gameOver: attemptsRemaining === 0
      });
    }

  } catch (error) {
    console.error('💥 [POST /api/final-guess] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('='.repeat(80) + '\n');
    return NextResponse.json({ error: 'Failed to process final guess' }, { status: 500 });
  }
}
