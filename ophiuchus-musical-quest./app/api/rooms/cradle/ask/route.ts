import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession, updateRoomCompletion } from '@/functions/gameState';
import { answerArtistQuestion } from '@/functions/roomLogic/cradle';

export async function POST(request: NextRequest) {
  console.log('\n' + '🌍 CRADLE ROOM - ASK QUESTION'.padEnd(80, ' '));
  console.log('─'.repeat(80));
  
  try {
    console.log('📡 [POST /api/rooms/cradle/ask] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('❌ [POST /api/rooms/cradle/ask] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ [POST /api/rooms/cradle/ask] User authenticated:', session.user.username);

    const body = await request.json();
    const { sessionId, question } = body;
    console.log('📥 [POST /api/rooms/cradle/ask] Request:', { sessionId, question });

    if (!sessionId || !question) {
      console.error('❌ [POST /api/rooms/cradle/ask] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      console.error('❌ [POST /api/rooms/cradle/ask] Game session not found');
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    // Check if already asked 5 questions
    const questionsAsked = gameSession.roomClues?.cradle?.questionsAsked || 0;
    console.log(`📊 [POST /api/rooms/cradle/ask] Questions asked: ${questionsAsked}/5`);

    if (questionsAsked >= 5) {
      console.error('❌ [POST /api/rooms/cradle/ask] Maximum questions reached');
      return NextResponse.json({ 
        error: 'Maximum questions reached',
        questionsRemaining: 0,
        canAsk: false
      }, { status: 400 });
    }

    const artistName = gameSession.cosmicSong.artists[0];
    console.log('🤖 [POST /api/rooms/cradle/ask] Generating answer for artist:', artistName);
    
    const answer = await answerArtistQuestion(question, artistName);
    console.log('✅ [POST /api/rooms/cradle/ask] Answer generated');

    // Update question count
    const newQuestionsAsked = questionsAsked + 1;
    const questionsRemaining = 5 - newQuestionsAsked;
    
    console.log('💾 [POST /api/rooms/cradle/ask] Updating question count...');
    await updateRoomCompletion(sessionId, 'cradle', {
      questionsAsked: newQuestionsAsked,
      attempts: gameSession.roomClues?.cradle?.attempts || 0,
      completed: gameSession.roomClues?.cradle?.completed || false,
      clue: gameSession.roomClues?.cradle?.clue || ''
    });
    console.log(`✅ [POST /api/rooms/cradle/ask] Questions remaining: ${questionsRemaining}`);

    console.log('─'.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      answer,
      questionsRemaining,
      canAsk: questionsRemaining > 0
    });

  } catch (error) {
    console.error('💥 [POST /api/rooms/cradle/ask] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('─'.repeat(80) + '\n');
    return NextResponse.json({ error: 'Failed to answer question' }, { status: 500 });
  }
}
