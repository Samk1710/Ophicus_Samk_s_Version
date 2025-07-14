import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSpotify from "./useSpotify";

export interface SpotifyUserStats {
  topArtist: {
    name: string;
    images: { url: string }[];
    followers?: { total: number };
    popularity?: number;
  } | null;
  minutesListened: number;
  topGenre: string;
  tracksPlayed: number;
  discoveryScore: number;
  activeDays: number;
  currentTrack: {
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
      name: string;
    };
    is_playing: boolean;
    progress_ms?: number;
    duration_ms?: number;
    external_urls?: { spotify: string };
  } | null;
  recentTracks: Array<{
    track: {
      name: string;
      artists: { name: string }[];
      album: {
        images: { url: string }[];
        name: string;
      };
      external_urls?: { spotify: string };
    };
    played_at: string;
  }>;
  userProfile: {
    display_name: string;
    followers: { total: number };
    images: { url: string }[];
    country?: string;
    product?: string;
  } | null;
  topTracks: Array<{
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
      name: string;
    };
    popularity: number;
    external_urls?: { spotify: string };
  }>;
}

export function useSpotifyUserData() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [userData, setUserData] = useState<SpotifyUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.accessToken) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching Spotify user data...");

        // Fetch user profile
        const userProfile = await spotifyApi.getMe();
        console.log("User profile fetched:", userProfile.body.display_name);

        // Fetch top artists (long term)
        const topArtists = await spotifyApi.getMyTopArtists({
          limit: 5,
          time_range: 'long_term'
        });
        console.log("Top artists fetched:", topArtists.body.items.length);

        // Fetch top tracks for calculating genres and other stats
        const topTracks = await spotifyApi.getMyTopTracks({
          limit: 50,
          time_range: 'medium_term'
        });
        console.log("Top tracks fetched:", topTracks.body.items.length);

        // Fetch currently playing track
        let currentTrack = null;
        try {
          const currentlyPlaying = await spotifyApi.getMyCurrentPlayingTrack();
          if (currentlyPlaying.body && currentlyPlaying.body.item) {
            currentTrack = {
              name: currentlyPlaying.body.item.name,
              artists: currentlyPlaying.body.item.artists,
              album: currentlyPlaying.body.item.album,
              is_playing: currentlyPlaying.body.is_playing,
              progress_ms: currentlyPlaying.body.progress_ms,
              duration_ms: currentlyPlaying.body.item.duration_ms,
              external_urls: currentlyPlaying.body.item.external_urls
            };
            console.log("Currently playing:", currentTrack.name);
          }
        } catch (currentTrackError) {
          console.log("No track currently playing");
        }

        // Fetch recent tracks
        const recentTracks = await spotifyApi.getMyRecentlyPlayedTracks({
          limit: 50
        });
        console.log("Recent tracks fetched:", recentTracks.body.items.length);

        // Calculate top genre from top tracks - with better error handling
        const genreCounts: { [key: string]: number } = {};
        let processedTracks = 0;
        
        for (const track of topTracks.body.items.slice(0, 20)) { // Limit to avoid rate limiting
          try {
            const artists = await Promise.all(
              track.artists.slice(0, 2).map(async (artist: any) => {
                try {
                  return await spotifyApi.getArtist(artist.id);
                } catch (artistError) {
                  console.warn(`Failed to fetch artist ${artist.name}:`, artistError);
                  return null;
                }
              })
            );
            
            for (const artist of artists) {
              if (artist && artist.body.genres) {
                for (const genre of artist.body.genres) {
                  genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                }
              }
            }
            processedTracks++;
          } catch (trackError) {
            console.warn(`Failed to process track ${track.name}:`, trackError);
          }
        }

        const topGenre = Object.keys(genreCounts).length > 0 
          ? Object.keys(genreCounts).reduce((a, b) => 
              genreCounts[a] > genreCounts[b] ? a : b
            )
          : 'Dream Pop';

        console.log("Top genre calculated:", topGenre);

        // Calculate estimated minutes listened (better approximation)
        const avgTrackLength = 3.5; // minutes
        const recentTracksCount = recentTracks.body.items.length;
        const estimatedMinutes = Math.floor(recentTracksCount * avgTrackLength * 15); // rough estimation

        // Calculate discovery score (percentage of unique artists in recent tracks)
        const uniqueArtists = new Set(
          recentTracks.body.items.map((item: any) => item.track.artists[0].name)
        );
        const discoveryScore = recentTracksCount > 0 
          ? Math.floor((uniqueArtists.size / recentTracksCount) * 100)
          : 0;

        // Calculate active days (days with activity in recent tracks)
        const activeDays = new Set(
          recentTracks.body.items.map((item: any) => 
            new Date(item.played_at).toDateString()
          )
        ).size;

        const userData: SpotifyUserStats = {
          topArtist: topArtists.body.items[0] ? {
            name: topArtists.body.items[0].name,
            images: topArtists.body.items[0].images,
            followers: topArtists.body.items[0].followers,
            popularity: topArtists.body.items[0].popularity
          } : null,
          minutesListened: estimatedMinutes,
          topGenre,
          tracksPlayed: recentTracksCount,
          discoveryScore,
          activeDays,
          currentTrack,
          recentTracks: recentTracks.body.items.slice(0, 6).map((item: any) => ({
            track: {
              name: item.track.name,
              artists: item.track.artists,
              album: item.track.album,
              external_urls: item.track.external_urls
            },
            played_at: item.played_at
          })),
          userProfile: userProfile.body,
          topTracks: topTracks.body.items.slice(0, 10).map((track: any) => ({
            name: track.name,
            artists: track.artists,
            album: track.album,
            popularity: track.popularity,
            external_urls: track.external_urls
          }))
        };

        console.log("User data compiled successfully");
        setUserData(userData);
      } catch (err) {
        console.error('Error fetching Spotify data:', err);
        setError('Failed to load Spotify data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.accessToken, spotifyApi]);

  return { userData, loading, error };
}
