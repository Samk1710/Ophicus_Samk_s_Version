import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { initializeBigBang } from '@/functions/bigbang';
import { createGameSession } from '@/functions/gameState';
import spotifyApi from '@/lib/spotify';
import { TrackWithHistory } from '@/hooks/useSpotifyUserData';
import connectDB from '@/lib/mongodb';
import GameSession from '@/lib/models/GameSession';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('\n' + '='.repeat(80));
  console.log('🌟 [POST /api/bigbang] BIG BANG INITIALIZATION STARTED');
  console.log('='.repeat(80));
  
  try {
    console.log('📡 [POST /api/bigbang] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      console.error('❌ [POST /api/bigbang] Unauthorized - no session or access token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ [POST /api/bigbang] User authenticated:', {
      username: session.user.username,
      hasAccessToken: !!session.user.accessToken
    });

    // Connect to DB and check for existing sessions (both active and completed)
    try {
      await connectDB();
    } catch (dbErr) {
      console.error('[POST /api/bigbang] Failed to connect to DB:', dbErr && dbErr.message ? dbErr.message : dbErr)
      return NextResponse.json({ error: 'Database connection failed', details: dbErr instanceof Error ? dbErr.message : String(dbErr) }, { status: 503 })
    }
    console.log('🗄️  [POST /api/bigbang] Checking for existing sessions...');
    
    const existingSessions = await GameSession.find({
      userId: session.user.username
    });

    if (existingSessions.length > 0) {
      console.log(`⚠️  [POST /api/bigbang] Found ${existingSessions.length} existing session(s), deleting...`);
      await GameSession.deleteMany({ userId: session.user.username });
      console.log('✅ [POST /api/bigbang] Old session(s) deleted');
    }

    // Set Spotify access token
    spotifyApi.setAccessToken(session.user.accessToken);
    console.log('🎵 [POST /api/bigbang] Spotify API configured');

    // Fetch user's Spotify data
    console.log('📥 [POST /api/bigbang] Fetching Spotify user data (saved, recent, top tracks)...');
    const fetchStart = Date.now();
    
    const [savedTracks, recentTracks, topTracks] = await Promise.all([
      spotifyApi.getMySavedTracks({ limit: 49 }),
      spotifyApi.getMyRecentlyPlayedTracks({ limit: 49 }),
      spotifyApi.getMyTopTracks({ limit: 49, time_range: 'medium_term' })
    ]);

    const fetchTime = Date.now() - fetchStart;
    console.log(`✅ [POST /api/bigbang] Spotify data fetched in ${fetchTime}ms:`, {
      savedTracks: savedTracks.body.items.length,
      recentTracks: recentTracks.body.items.length,
      topTracks: topTracks.body.items.length
    });

    // Combine and deduplicate tracks
    const allTracks: Map<string, TrackWithHistory> = new Map();

    // Add saved tracks
    savedTracks.body.items.forEach((item: any) => {
      const track = item.track;
      allTracks.set(track.id, {
        id: track.id,
        name: track.name,
        artists: track.artists.map((a: any) => ({ name: a.name, id: a.id })),
        album: {
          images: track.album.images,
          name: track.album.name,
          id: track.album.id
        },
        popularity: track.popularity,
        duration_ms: track.duration_ms,
        external_urls: track.external_urls,
        play_count: 1,
        sources: [{ type: 'saved', added_at: item.added_at }]
      });
    });

    // Add recent tracks
    recentTracks.body.items.forEach((item: any) => {
      const track = item.track;
      const existing = allTracks.get(track.id);
      if (existing) {
        existing.play_count++;
        existing.sources.push({ type: 'recent', played_at: item.played_at });
      } else {
        allTracks.set(track.id, {
          id: track.id,
          name: track.name,
          artists: track.artists.map((a: any) => ({ name: a.name, id: a.id })),
          album: {
            images: track.album.images,
            name: track.album.name,
            id: track.album.id
          },
          popularity: track.popularity,
          duration_ms: track.duration_ms,
          external_urls: track.external_urls,
          play_count: 1,
          sources: [{ type: 'recent', played_at: item.played_at }]
        });
      }
    });

    // Add top tracks
    topTracks.body.items.forEach((track: any) => {
      const existing = allTracks.get(track.id);
      if (existing) {
        existing.play_count += 2; // Weight top tracks higher
      } else {
        allTracks.set(track.id, {
          id: track.id,
          name: track.name,
          artists: track.artists.map((a: any) => ({ name: a.name, id: a.id })),
          album: {
            images: track.album.images,
            name: track.album.name,
            id: track.album.id
          },
          popularity: track.popularity,
          duration_ms: track.duration_ms,
          external_urls: track.external_urls,
          play_count: 2,
          sources: [{ type: 'saved' }]
        });
      }
    });

    const tracksArray = Array.from(allTracks.values());
    console.log('🎼 [POST /api/bigbang] Total unique tracks after deduplication:', tracksArray.length);
    console.log('🎯 [POST /api/bigbang] Top 5 tracks by play count:', 
      tracksArray
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, 5)
        .map(t => `"${t.name}" (${t.play_count} plays)`)
    );

    // Initialize Big Bang
    console.log('💫 [POST /api/bigbang] Initializing Big Bang (selecting cosmic song)...');
    const bigBangStart = Date.now();
    const bigBangResult = await initializeBigBang(tracksArray);
    const bigBangTime = Date.now() - bigBangStart;
    
    console.log(`✅ [POST /api/bigbang] Big Bang completed in ${bigBangTime}ms`);
    console.log('🌟 [POST /api/bigbang] Cosmic Song selected:', {
      name: bigBangResult.cosmicSong.name,
      artist: bigBangResult.cosmicSong.artists.join(', '),
      id: bigBangResult.cosmicSong.id
    });
    console.log('🌌 [POST /api/bigbang] Intermediary Songs:', 
      bigBangResult.intermediarySongs.map(s => `"${s.name}" by ${s.artists.join(', ')}`)
    );
    console.log('📜 [POST /api/bigbang] Initial Clue:', bigBangResult.initialClue.substring(0, 100) + '...');

    // Get user profile
    console.log('👤 [POST /api/bigbang] Fetching user profile...');
    const userProfile = await spotifyApi.getMe();
    console.log('✅ [POST /api/bigbang] User profile fetched:', userProfile.body.id);
    
    // Create game session in database
    console.log('💾 [POST /api/bigbang] Creating game session in MongoDB...');
    const dbStart = Date.now();
    const gameSession = await createGameSession(
      session.user.username || '',
      userProfile.body.id,
      bigBangResult.cosmicSong,
      bigBangResult.intermediarySongs,
      bigBangResult.initialClue
    );
    const dbTime = Date.now() - dbStart;

    const sessionId = (gameSession as any)._id.toString();
    console.log(`✅ [POST /api/bigbang] Game session created in ${dbTime}ms:`, sessionId);

    const totalTime = Date.now() - startTime;
    console.log('='.repeat(80));
    console.log(`🎉 [POST /api/bigbang] BIG BANG COMPLETE! Total time: ${totalTime}ms`);
    console.log('='.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      sessionId,
      initialClue: bigBangResult.initialClue,
      cosmicSongId: bigBangResult.cosmicSong.id // Hidden from user, but tracked
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('='.repeat(80));
    console.error('💥 [POST /api/bigbang] BIG BANG FAILED after', totalTime, 'ms');
    console.error('❌ [POST /api/bigbang] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    console.error('='.repeat(80) + '\n');
    
    return NextResponse.json(
      { error: 'Failed to initialize Big Bang', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
