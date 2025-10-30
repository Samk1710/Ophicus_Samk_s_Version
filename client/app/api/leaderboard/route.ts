import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Leaderboard from '@/lib/models/Leaderboard';
import UserProfile from '@/lib/models/UserProfile';
import connectDB from '@/lib/mongodb';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function GET(request: NextRequest) {
  console.log('\n' + '🏆 LEADERBOARD - GET TOP PLAYERS'.padEnd(80, ' '));
  console.log('─'.repeat(80));
  
  try {
    console.log('📡 [GET /api/leaderboard] Checking authentication...');

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('❌ [GET /api/leaderboard] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ [GET /api/leaderboard] User authenticated:', session.user.username);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    console.log('📊 [GET /api/leaderboard] Query params:', { limit, skip });

    await connectDB();

    // Get top players sorted by total points from Leaderboard model
    console.log('🔍 [GET /api/leaderboard] Fetching top players...');
    const topPlayers = await Leaderboard
      .find({})
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(limit)
      .select('userId username spotifyUserId totalPoints totalGamesCompleted highestSingleGamePoints lastPlayedAt')
      .lean();

    console.log(`✅ [GET /api/leaderboard] Found ${topPlayers.length} players`);

    // Enrich with Spotify display names
    spotifyApi.setAccessToken(session.user.accessToken);
    const enrichedPlayers = await Promise.all(
      topPlayers.map(async (player: any) => {
        let displayName = player.username; // fallback
        
        try {
          if (player.spotifyUserId) {
            const userProfile = await spotifyApi.getUser(player.spotifyUserId);
            displayName = userProfile.body.display_name || userProfile.body.id;
            console.log(`[GET /api/leaderboard] Fetched Spotify name: ${displayName}`);
          }
        } catch (error) {
          console.warn(`[GET /api/leaderboard] Failed to fetch Spotify name for ${player.spotifyUserId}`);
        }
        
        return { ...player, username: displayName };
      })
    );

    // Get current user's leaderboard entry (by userId)
    const currentUserEntry = await Leaderboard.findOne({ userId: session.user.username }).lean();

    let currentUserRank = null;
    let currentUserResponse = null;
    if (currentUserEntry) {
      const higherRankedCount = await Leaderboard.countDocuments({
        totalPoints: { $gt: (currentUserEntry as any).totalPoints }
      });
      currentUserRank = higherRankedCount + 1;
      console.log(`🎯 [GET /api/leaderboard] Current user rank: ${currentUserRank}`);

      // Try to fetch Spotify display name for the current user if possible
      let currentDisplay = (currentUserEntry as any).username || (currentUserEntry as any).userId;
      try {
        if ((currentUserEntry as any).spotifyUserId) {
          const profile = await spotifyApi.getUser((currentUserEntry as any).spotifyUserId);
          currentDisplay = profile.body.display_name || profile.body.id || currentDisplay;
          console.log(`[GET /api/leaderboard] Fetched Spotify name for current user: ${currentDisplay}`);
        }
      } catch (err) {
        console.warn('[GET /api/leaderboard] Failed to fetch Spotify name for current user', err);
      }

      currentUserResponse = {
        username: currentDisplay,
        totalPoints: (currentUserEntry as any).totalPoints,
        totalGamesCompleted: (currentUserEntry as any).totalGamesCompleted,
        rank: currentUserRank
      };
    }

    // Get total player count
    const totalPlayers = await Leaderboard.countDocuments({});
    console.log(`📈 [GET /api/leaderboard] Total players: ${totalPlayers}`);

    // Format leaderboard entries with rank
    const leaderboard = enrichedPlayers.map((player: any, index) => ({
      rank: skip + index + 1,
      username: player.username,
      totalPoints: player.totalPoints,
      totalGamesCompleted: player.totalGamesCompleted,
      highestSingleGamePoints: player.highestSingleGamePoints,
      isCurrentUser: player.userId === session.user.username
    }));

    console.log('─'.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      leaderboard,
  currentUser: currentUserResponse,
      pagination: {
        total: totalPlayers,
        limit,
        skip,
        hasMore: skip + limit < totalPlayers
      }
    });

  } catch (error) {
    console.error('💥 [GET /api/leaderboard] Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('─'.repeat(80) + '\n');
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

// POST /api/leaderboard - migration helper (authenticated)
export async function POST(request: NextRequest) {
  console.log('\n' + '🏷 LEADERBOARD - POST MIGRATE USERNAMES'.padEnd(80, ' '));
  console.log('─'.repeat(80));
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For safety, only allow the session user who is an admin (you can restrict by username here)
    // If you want this open for dev, remove the check below.
    const allowedAdmin = process.env.ADMIN_USER_ID || session.user.username;
    if (session.user.username !== allowedAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    // Update UserProfile where spotifyUserId exists
    const upRes = await UserProfile.updateMany(
      { spotifyUserId: { $exists: true, $ne: null } },
      [{ $set: { username: '$spotifyUserId' } }]
    );

    // Update Leaderboard where spotifyUserId exists
    const lbRes = await Leaderboard.updateMany(
      { spotifyUserId: { $exists: true, $ne: null } },
      [{ $set: { username: '$spotifyUserId' } }]
    );

    console.log('[POST /api/leaderboard] Migration results:', { upRes, lbRes });
    return NextResponse.json({ success: true, upRes, lbRes });
  } catch (error) {
    console.error('[POST /api/leaderboard] Migration error:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
