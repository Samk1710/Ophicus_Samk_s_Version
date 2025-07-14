import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSpotify from "./useSpotify";

export interface SpotifyUserStats {
  topArtist: {
    name: string;
    images: { url: string }[];
    followers?: { total: number };
    popularity?: number;
    genres?: string[];
    external_urls?: { spotify: string };
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
    played_at?: string;
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
  topArtists: Array<{
    name: string;
    images: { url: string }[];
    followers?: { total: number };
    popularity?: number;
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

    const fetchUserData = async (artistLimit: number = 5, trackLimit: number = 50, recentTracksLimit: number = 50) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching Spotify user data...");

        // Fetch user profile
        const userProfile = await spotifyApi.getMe();
        console.log("User profile fetched:", userProfile.body.display_name);

        // Fetch top artists (long term) with detailed info
        const topArtists = await spotifyApi.getMyTopArtists({
          limit: artistLimit,
          time_range: 'long_term'
        });
        console.log("Top artists fetched:", topArtists.body);

        // Get detailed artist info for the top artist
        let topArtistDetails = null;
        if (topArtists.body.items.length > 0) {

          const artistId = topArtists.body.items[0].id;
          const artistDetails = await spotifyApi.getArtist(artistId);
          topArtistDetails = {
            name: artistDetails.body.name,
            images: artistDetails.body.images,
            followers: artistDetails.body.followers,
            popularity: artistDetails.body.popularity,
            genres: artistDetails.body.genres,
            external_urls: artistDetails.body.external_urls
          };
        }

        // Fetch top tracks for calculating genres and other stats
        const topTracks = await spotifyApi.getMyTopTracks({
          limit: trackLimit,
          time_range: 'medium_term'
        });
        console.log("Top tracks fetched:", topTracks.body.items.length);

        // Fetch currently playing track or last played track
        let currentOrLastTrack = null;
        try {
          const currentlyPlaying = await spotifyApi.getMyCurrentPlayingTrack();
          if (currentlyPlaying.body && currentlyPlaying.body.item) {
            currentOrLastTrack = {
              name: currentlyPlaying.body.item.name,
              artists: currentlyPlaying.body.item.artists,
              album: currentlyPlaying.body.item.album,
              is_playing: currentlyPlaying.body.is_playing,
              progress_ms: currentlyPlaying.body.progress_ms,
              duration_ms: currentlyPlaying.body.item.duration_ms,
              external_urls: currentlyPlaying.body.item.external_urls
            };
            console.log("Currently playing:", currentOrLastTrack.name);
          }
        } catch (currentTrackError) {
          console.log("No track currently playing, fetching last played track");
        }

        // If no current track, get the last played track
        if (!currentOrLastTrack) {
          try {
            const recentTracksForCurrent = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
            if (recentTracksForCurrent.body.items.length > 0) {
              const lastTrack = recentTracksForCurrent.body.items[0];
              currentOrLastTrack = {
                name: lastTrack.track.name,
                artists: lastTrack.track.artists,
                album: lastTrack.track.album,
                is_playing: false,
                external_urls: lastTrack.track.external_urls,
                played_at: lastTrack.played_at
              };
              console.log("Last played track:", currentOrLastTrack.name);
            }
          } catch (lastTrackError) {
            console.log("Failed to fetch last played track:", lastTrackError);
          }
        }

        // Fetch recent tracks
        const recentTracks = await spotifyApi.getMyRecentlyPlayedTracks({
          limit: recentTracksLimit || 100
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

        // Calculate estimated minutes listened for current month only
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const currentMonthTracks = recentTracks.body.items.filter((item: any) => {
          const playedDate = new Date(item.played_at);
          return playedDate.getMonth() === currentMonth && playedDate.getFullYear() === currentYear;
        });
        
        const avgTrackLength = 3.5; // minutes
        const estimatedMinutes = Math.floor(currentMonthTracks.length * avgTrackLength * 15); // improved estimation

        // Calculate discovery score (percentage of unique artists in recent tracks)
        const uniqueArtists = new Set(
          recentTracks.body.items.map((item: any) => item.track.artists[0].name)
        );
        const discoveryScore = recentTracks.body.items.length > 0 
          ? Math.floor((uniqueArtists.size / recentTracks.body.items.length) * 100)
          : 0;

        // Calculate active days for current month
        const currentMonthActiveDays = new Set(
          currentMonthTracks.map((item: any) => 
            new Date(item.played_at).toDateString()
          )
        ).size;

        const userData: SpotifyUserStats = {
          topArtist: topArtistDetails,
          minutesListened: estimatedMinutes,
          topGenre,
          tracksPlayed: currentMonthTracks.length,
          discoveryScore,
          activeDays: currentMonthActiveDays,
          currentTrack: currentOrLastTrack,
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
          })),
          topArtists: topArtists.body.items.slice(0, 10).map((artist: any) => ({
            name: artist.name,
            images: artist.images,
            followers: artist.followers,
            popularity: artist.popularity,
            external_urls: artist.external_urls
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
