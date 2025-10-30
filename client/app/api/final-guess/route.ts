import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { submitFinalGuess, setOphiuchusIdentity, markRoomFinalStatus } from '@/functions/gameState';
import { generateOphiuchusIdentity } from '@/functions/bigbang';
import { completeGameSession } from '@/functions/leaderboard';
import GameSession from '@/lib/models/GameSession';

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
      
      // Calculate points based on attempts (300, 200, 100)
      const attemptPoints = result.session.finalGuessAttempts === 1 ? 300 
                          : result.session.finalGuessAttempts === 2 ? 200 
                          : 100;
      
      // Add revelation points to total
      result.session.totalPoints = (result.session.totalPoints || 0) + attemptPoints;
      await result.session.save();
      
      console.log(`🎯 [POST /api/final-guess] Revelation points awarded: ${attemptPoints} (attempt ${result.session.finalGuessAttempts})`);
      console.log(`📊 [POST /api/final-guess] New total points: ${result.session.totalPoints}`);
      
      const musicProfile = `User has completed ${result.session.roomsCompleted.length} cosmic chambers. Their journey led them to discover their cosmic song: "${result.session.cosmicSong.name}" by ${result.session.cosmicSong.artists.join(', ')}.`;
      console.log('📝 [POST /api/final-guess] Music profile:', musicProfile);
      
      const startTime = Date.now();
      const identity = await generateOphiuchusIdentity(
        result.session.cosmicSong,
        musicProfile
      );
      const genTime = Date.now() - startTime;

      console.log(`✅ [POST /api/final-guess] Ophiuchus identity generated in ${genTime}ms`);
      console.log('👑 [POST /api/final-guess] Title:', identity.title);
      console.log('📜 [POST /api/final-guess] Description:', identity.description?.substring(0, 100) + '...');
      
      if (identity.imageUrl) {
        console.log('🖼️  [POST /api/final-guess] Image URL:', identity.imageUrl);
      }

      // Save identity object directly to database
      await setOphiuchusIdentity(sessionId, identity);
      console.log('💾 [POST /api/final-guess] Identity saved to database');

      console.log('='.repeat(80));
      console.log('🎊 QUEST COMPLETE! User has achieved cosmic enlightenment!');
      console.log('='.repeat(80) + '\n');

      // Build roomPoints object from roomClues
      const roomPoints = {
        nebula: result.session.roomClues?.nebula?.points || 0,
        cradle: result.session.roomClues?.cradle?.points || 0,
        comet: result.session.roomClues?.comet?.points || 0,
        aurora: result.session.roomClues?.aurora?.points || 0,
        nova: result.session.roomClues?.nova?.points || 0
      };

      // Extract Nebula and Comet songs from intermediarySongs
      const nebulaSong = result.session.intermediarySongs?.[0] || null;
      const cometSong = result.session.intermediarySongs?.[1] || null;

      console.log('🔮 [POST /api/final-guess] Nebula song:', nebulaSong?.name);
      console.log('🔥 [POST /api/final-guess] Comet song:', cometSong?.name);

      // Mark session as completed but DON'T delete it yet
      try {
        result.session.completed = true;
        await result.session.save();
        console.log('✅ [POST /api/final-guess] Game session marked as completed');
        
        // Archive to leaderboard but keep session in DB for now
        await completeGameSession(sessionId);        
        console.log('✅ [POST /api/final-guess] Game session archived to leaderboard');

        // After successful archive, delete the active session document to clean up
        try {
          await GameSession.findByIdAndDelete(sessionId);
          console.log('✅ [POST /api/final-guess] Game session deleted from active sessions');
        } catch (delErr) {
          console.error('❌ [POST /api/final-guess] Failed to delete session after archiving:', delErr);
        }
      } catch (error) {
        console.error('❌ [POST /api/final-guess] Failed to complete game session:', error);
        // Continue anyway - user still gets success response
      }

      return NextResponse.json({
        success: true,
        correct: true,
        cosmicSong: result.session.cosmicSong,
        ophiuchusIdentity: identity,
        attemptsUsed: result.session.finalGuessAttempts,
        pointsEarned: attemptPoints,
        totalPoints: result.session.totalPoints,
        questSummary: {
          cosmicSong: result.session.cosmicSong,
          ophiuchusIdentity: identity,
          roomPoints: roomPoints,
          revelationPoints: attemptPoints,
          totalPoints: result.session.totalPoints,
          finalGuessAttempts: result.session.finalGuessAttempts,
          nebulaSong: nebulaSong,
          cometSong: cometSong
        }
      });
    } else {
      // Safely calculate attempts remaining (prevent negative values)
      const attemptsRemaining = Math.max(0, 3 - result.session.finalGuessAttempts);
      const gameOver = result.session.finalGuessAttempts >= 3;
      
      console.log(`⚠️  [POST /api/final-guess] Attempts: ${result.session.finalGuessAttempts}/3, Remaining: ${attemptsRemaining}`);
      
      let pointsEarned = 0;
      let cosmicSongRevealed = null;
      
      if (gameOver) {
        console.log('💔 [POST /api/final-guess] GAME OVER - All attempts exhausted');
        
        // Award 25 points for trying
        pointsEarned = 25;
        result.session.totalPoints = (result.session.totalPoints || 0) + pointsEarned;
        
        // Build roomPoints for summary
        const roomPoints = {
          nebula: result.session.roomClues?.nebula?.points || 0,
          cradle: result.session.roomClues?.cradle?.points || 0,
          comet: result.session.roomClues?.comet?.points || 0,
          aurora: result.session.roomClues?.aurora?.points || 0,
          nova: result.session.roomClues?.nova?.points || 0
        };
        
        // Reveal the cosmic song for the failure popup
        cosmicSongRevealed = result.session.cosmicSong;

        // Extract Nebula and Comet songs from intermediarySongs
        const nebulaSong = result.session.intermediarySongs?.[0] || null;
        const cometSong = result.session.intermediarySongs?.[1] || null;
        
        console.log(`🎁 [POST /api/final-guess] Consolation points awarded: ${pointsEarned}`);
        console.log(`📊 [POST /api/final-guess] Final total points: ${result.session.totalPoints}`);
        console.log(`🎵 [POST /api/final-guess] Cosmic song revealed: ${cosmicSongRevealed?.name}`);
        console.log('🔮 [POST /api/final-guess] Nebula song:', nebulaSong?.name);
        console.log('🔥 [POST /api/final-guess] Comet song:', cometSong?.name);
        
        // Mark session as completed (failed) and archive it
        try {
          result.session.completed = true; // Mark as completed even though they failed
          await result.session.save();

          const lastRoom = (result.session.roomsCompleted && result.session.roomsCompleted.length > 0)
            ? result.session.roomsCompleted[result.session.roomsCompleted.length - 1]
            : 'nova';

          // Mark the room as wrong
          await markRoomFinalStatus(sessionId, lastRoom, 'wrong');

          await completeGameSession(sessionId);
          console.log('✅ [POST /api/final-guess] Failed game session archived');

          try {
            await GameSession.findByIdAndDelete(sessionId);
            console.log('✅ [POST /api/final-guess] Game session deleted from active sessions after failure');
          } catch (delErr) {
            console.error('❌ [POST /api/final-guess] Failed to delete session after archiving failed session:', delErr);
          }

        } catch (error) {
          console.error('❌ [POST /api/final-guess] Failed to archive game session:', error);
        }
      }
      
      console.log('='.repeat(80) + '\n');

      return NextResponse.json({
        success: true,
        correct: false,
        attemptsRemaining,
        gameOver,
        pointsEarned,
        totalPoints: result.session.totalPoints,
        ...(gameOver && {
          cosmicSong: cosmicSongRevealed,
          questSummary: {
            cosmicSong: cosmicSongRevealed,
            roomPoints: {
              nebula: result.session.roomClues?.nebula?.points || 0,
              cradle: result.session.roomClues?.cradle?.points || 0,
              comet: result.session.roomClues?.comet?.points || 0,
              aurora: result.session.roomClues?.aurora?.points || 0,
              nova: result.session.roomClues?.nova?.points || 0
            },
            revelationPoints: pointsEarned,
            totalPoints: result.session.totalPoints,
            finalGuessAttempts: result.session.finalGuessAttempts,
            nebulaSong: result.session.intermediarySongs?.[0] || null,
            cometSong: result.session.intermediarySongs?.[1] || null
          }
        })
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
