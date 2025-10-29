import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGameSession, updateRoomCompletion } from '@/functions/gameState';
import { generateNovaQuestions, scoreNovaAnswers, generateNovaReward } from '@/functions/roomLogic/nova';
import spotifyApi from '@/lib/spotify';
import { SpotifyUserStats } from '@/hooks/useSpotifyUserData';

export async function GET(request: NextRequest) {
  try {
    console.log('[GET /api/rooms/nova] Generating memory questions');

    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    // Check if already completed
    if (gameSession.roomClues?.nova?.completed) {
      return NextResponse.json({
        success: true,
        completed: true
      });
    }

    // Fetch user's Spotify data for questions
    spotifyApi.setAccessToken(session.user.accessToken);

    const [topArtistsData, topTracksData, recentTracksData] = await Promise.all([
      spotifyApi.getMyTopArtists({ limit: 1, time_range: 'short_term' }),
      spotifyApi.getMyTopTracks({ limit: 5, time_range: 'short_term' }),
      spotifyApi.getMyRecentlyPlayedTracks({ limit: 10 })
    ]);

    const userData: SpotifyUserStats = {
      topArtist: topArtistsData.body.items[0] || null,
      topGenre: topArtistsData.body.items[0]?.genres[0] || 'Pop',
      topTracks: topTracksData.body.items.map((track: any) => ({
        name: track.name,
        artists: track.artists,
        album: track.album,
        popularity: track.popularity,
        external_urls: track.external_urls
      })),
      recentTracks: recentTracksData.body.items.map((item: any) => ({
        track: item.track,
        played_at: item.played_at
      })),
      minutesListened: 0,
      tracksPlayed: 0,
      discoveryScore: 0,
      currentTrack: null,
      userProfile: null,
      topArtists: [],
      savedTracks: [],
      playlistTracks: [],
      followedUserTracks: []
    };

    const questions = await generateNovaQuestions(userData, gameSession.cosmicSong);

    console.log('[GET /api/rooms/nova] Generated', questions.length, 'questions');

    return NextResponse.json({
      success: true,
      questions
    });

  } catch (error) {
    console.error('[GET /api/rooms/nova] Error:', error);
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[POST /api/rooms/nova] Processing answers');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, answers, questions } = body;

    if (!sessionId || !answers || !questions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gameSession = await getGameSession(sessionId);
    if (!gameSession) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    const score = scoreNovaAnswers(answers, questions);
    console.log('[POST /api/rooms/nova] Score:', score, '/', questions.length);

    // Calculate points: 20 points per correct answer, minimum 10 if all wrong
    let points = score > 0 ? score * 20 : 10; // Award 10 points if all wrong
    console.log('[POST /api/rooms/nova] Points awarded:', points);

    const reward = await generateNovaReward(gameSession.cosmicSong, score);

    await updateRoomCompletion(sessionId, 'nova', {
      clue: reward.content,
      score,
      points: points,
      completed: true
    });
    
    // Update total points in session
    gameSession.totalPoints = (gameSession.totalPoints || 0) + points;
    await gameSession.save();

    console.log('[POST /api/rooms/nova] Room completed. Total points:', gameSession.totalPoints);

    // Celebrate if they got perfect score
    const isPerfect = score === questions.length;

    return NextResponse.json({
      success: true,
      score,
      totalQuestions: questions.length,
      points,
      celebrateCorrect: isPerfect, // Trigger confetti on perfect score
      reward
    });

  } catch (error) {
    console.error('[POST /api/rooms/nova] Error:', error);
    return NextResponse.json({ error: 'Failed to process answers' }, { status: 500 });
  }
}
