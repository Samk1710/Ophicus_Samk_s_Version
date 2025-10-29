import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserProfile from '@/lib/models/UserProfile';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find user profile
    const profile = await UserProfile.findOne({ username: session.user.username });
    
    if (!profile) {
      return NextResponse.json({ quests: [] });
    }

    // Sort quests by completion date (newest first)
    const quests = profile.completedGames
      .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    return NextResponse.json({ quests });
  } catch (error) {
    console.error('[GET /api/user/quests] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch quests' }, { status: 500 });
  }
}
