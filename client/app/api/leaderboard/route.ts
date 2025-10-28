import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserProfile from '@/lib/models/UserProfile';
import connectDB from '@/lib/mongodb';

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

    // Get top players sorted by total points
    console.log('🔍 [GET /api/leaderboard] Fetching top players...');
    const topPlayers = await UserProfile
      .find({})
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(limit)
      .select('username totalPoints totalGamesPlayed userId')
      .lean();

    console.log(`✅ [GET /api/leaderboard] Found ${topPlayers.length} players`);

    // Get current user's rank
    const currentUserProfile = await UserProfile.findOne({ 
      userId: session.user.username 
    }).lean();

    let currentUserRank = null;
    if (currentUserProfile) {
      const higherRankedCount = await UserProfile.countDocuments({
        totalPoints: { $gt: (currentUserProfile as any).totalPoints }
      });
      currentUserRank = higherRankedCount + 1;
      console.log(`🎯 [GET /api/leaderboard] Current user rank: ${currentUserRank}`);
    }

    // Get total player count
    const totalPlayers = await UserProfile.countDocuments({});
    console.log(`📈 [GET /api/leaderboard] Total players: ${totalPlayers}`);

    // Format leaderboard entries with rank
    const leaderboard = topPlayers.map((player: any, index) => ({
      rank: skip + index + 1,
      username: player.username,
      totalPoints: player.totalPoints,
      totalGamesPlayed: player.totalGamesPlayed,
      isCurrentUser: player.userId === session.user.username
    }));

    console.log('─'.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      leaderboard,
      currentUser: currentUserProfile ? {
        username: (currentUserProfile as any).username,
        totalPoints: (currentUserProfile as any).totalPoints,
        totalGamesPlayed: (currentUserProfile as any).totalGamesPlayed,
        rank: currentUserRank
      } : null,
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
