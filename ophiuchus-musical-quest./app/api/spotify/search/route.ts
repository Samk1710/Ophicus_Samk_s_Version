import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import spotifyApi from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    console.log('[GET /api/spotify/search] Starting search');

    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      console.log('[GET /api/spotify/search] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'track'; // 'track' or 'artist'
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    console.log('[GET /api/spotify/search] Query:', query, 'Type:', type);

    spotifyApi.setAccessToken(session.user.accessToken);

    const searchResult = await spotifyApi.search(query, [type as any], { limit });

    let results: any[] = [];
    if (type === 'track' && searchResult.body.tracks) {
      results = searchResult.body.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((a: any) => a.name),
        album: track.album.name,
        imageUrl: track.album.images[0]?.url,
        spotifyUrl: track.external_urls.spotify
      }));
    } else if (type === 'artist' && searchResult.body.artists) {
      results = searchResult.body.artists.items.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images[0]?.url,
        followers: artist.followers.total,
        spotifyUrl: artist.external_urls.spotify
      }));
    }

    console.log('[GET /api/spotify/search] Found', results.length, 'results');

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('[GET /api/spotify/search] Error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
