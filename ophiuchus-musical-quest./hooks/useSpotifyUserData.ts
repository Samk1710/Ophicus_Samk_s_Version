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
  // New properties for additional data
  savedTracks: Array<{
    track: {
      id: string;
      name: string;
      artists: { name: string; id: string }[];
      album: {
        images: { url: string }[];
        name: string;
        id: string;
      };
      popularity: number;
      duration_ms: number;
      external_urls?: { spotify: string };
    };
    added_at: string;
  }>;
  playlistTracks: Array<{
    track: {
      id: string;
      name: string;
      artists: { name: string; id: string }[];
      album: {
        images: { url: string }[];
        name: string;
        id: string;
      };
      popularity: number;
      duration_ms: number;
      external_urls?: { spotify: string };
    };
    playlist_name: string;
    playlist_id: string;
    added_at: string;
  }>;
  followedUserTracks: Array<{
    track: {
      id: string;
      name: string;
      artists: { name: string; id: string }[];
      album: {
        images: { url: string }[];
        name: string;
        id: string;
      };
      popularity: number;
      duration_ms: number;
      external_urls?: { spotify: string };
    };
    user_name: string;
    user_id: string;
    playlist_name: string;
  }>;
}

export interface TrackWithHistory {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: {
    images: { url: string }[];
    name: string;
    id: string;
  };
  popularity: number;
  duration_ms: number;
  external_urls?: { spotify: string };
  play_count: number;
  sources: Array<{
    type: 'recent' | 'saved' | 'playlist' | 'followed_user';
    source_name?: string;
    added_at?: string;
    played_at?: string;
  }>;
  audio_features?: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    key: number;
    mode: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    speechiness: number;
  };
}

export function useSpotifyUserData() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [userData, setUserData] = useState<SpotifyUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedTracks = async (limit: number = 49) => {
    try {
      console.log("Fetching saved tracks...");
      const savedTracks = await spotifyApi.getMySavedTracks({ limit: Math.min(limit, 49) });
      return savedTracks.body.items.map((item: any) => ({
        track: {
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists,
          album: item.track.album,
          popularity: item.track.popularity,
          duration_ms: item.track.duration_ms,
          external_urls: item.track.external_urls
        },
        added_at: item.added_at
      }));
    } catch (err) {
      console.error("Error fetching saved tracks:", err);
      return [];
    }
  };

  const fetchPlaylistTracks = async (limit: number = 49) => {
    try {
      console.log("Fetching user playlists...");
      const playlists = await spotifyApi.getUserPlaylists({ limit: Math.min(10, 49) });
      const playlistTracks = [];

      for (const playlist of playlists.body.items) {
        try {
          const tracks = await spotifyApi.getPlaylistTracks(playlist.id, { limit: Math.min(limit, 49) });
          for (const item of tracks.body.items) {
            if (item.track && item.track.type === 'track') {
              playlistTracks.push({
                track: {
                  id: item.track.id,
                  name: item.track.name,
                  artists: item.track.artists,
                  album: item.track.album,
                  popularity: item.track.popularity,
                  duration_ms: item.track.duration_ms,
                  external_urls: item.track.external_urls
                },
                playlist_name: playlist.name,
                playlist_id: playlist.id,
                added_at: item.added_at
              });
            }
          }
        } catch (playlistError) {
          console.warn(`Error fetching tracks from playlist ${playlist.name}:`, playlistError);
        }
      }

      return playlistTracks;
    } catch (err) {
      console.error("Error fetching playlist tracks:", err);
      return [];
    }
  };

  const fetchFollowedUserTracks = async () => {
    try {
      console.log("Fetching followed users...");
      const followedUsers = await spotifyApi.getFollowedArtists({ limit: Math.min(10, 49) });
      const userTracks = [];

      // Note: Spotify API doesn't directly provide followed users' playlists for privacy reasons
      // This is a mock implementation - in reality, you'd need to use different endpoints
      // or the user would need to manually share playlist IDs
      
      // For demonstration, we'll fetch public playlists from some followed artists
      // This is a simplified approach
      for (const artist of followedUsers.body.artists.items.slice(0, 3)) {
        try {
          // Search for playlists by this artist (this is a workaround)
          const searchResults = await spotifyApi.searchPlaylists(`owner:${artist.id}`, { limit: Math.min(2, 49) });
          
          for (const playlist of searchResults.body.playlists.items) {
            try {
              const tracks = await spotifyApi.getPlaylistTracks(playlist.id, { limit: Math.min(10, 49) });
              for (const item of tracks.body.items) {
                if (item.track && item.track.type === 'track') {
                  userTracks.push({
                    track: {
                      id: item.track.id,
                      name: item.track.name,
                      artists: item.track.artists,
                      album: item.track.album,
                      popularity: item.track.popularity,
                      duration_ms: item.track.duration_ms,
                      external_urls: item.track.external_urls
                    },
                    user_name: artist.name,
                    user_id: artist.id,
                    playlist_name: playlist.name
                  });
                }
              }
            } catch (playlistError) {
              console.warn(`Error fetching tracks from ${artist.name}'s playlist:`, playlistError);
            }
          }
        } catch (searchError) {
          console.warn(`Error searching playlists for ${artist.name}:`, searchError);
        }
      }

      return userTracks;
    } catch (err) {
      console.error("Error fetching followed user tracks:", err);
      return [];
    }
  };

  useEffect(() => {
    if (!session?.user?.accessToken) {
      setLoading(false);
      return;
    }

    const fetchUserData = async (artistLimit: number = 5, trackLimit: number = 49, recentTracksLimit: number = 49) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching Spotify user data...");

        // Fetch user profile
        const userProfile = await spotifyApi.getMe();
        console.log("User profile fetched:", userProfile.body.display_name);

        // Fetch top artists (long term) with detailed info
        const topArtists = await spotifyApi.getMyTopArtists({
          limit: Math.min(artistLimit, 49),
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
          limit: Math.min(trackLimit, 49),
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
          limit: Math.min(recentTracksLimit || 49, 49)
        });
        console.log("Recent tracks fetched:", recentTracks.body.items.length);

        // Fetch additional data
        const [savedTracks, playlistTracks, followedUserTracks] = await Promise.all([
          fetchSavedTracks(49),
          fetchPlaylistTracks(49),
          fetchFollowedUserTracks()
        ]);

        console.log("Additional data fetched:", {
          savedTracks: savedTracks.length,
          playlistTracks: playlistTracks.length,
          followedUserTracks: followedUserTracks.length
        });

        // Calculate top genre from top tracks - with better error handling
        const genreCounts: { [key: string]: number } = {};
        let processedTracks = 0;
        
        for (const track of topTracks.body.items.slice(0, 20)) {
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
        
        // Calculate actual minutes based on track durations
        const totalMinutes = currentMonthTracks.reduce((total: number, item: any) => {
          const durationMs = item.track.duration_ms || 0;
          const durationMinutes = durationMs / (1000 * 60);
          return total + durationMinutes;
        }, 0);
        
        const estimatedMinutes = Math.floor(totalMinutes);

        // Calculate discovery score
        const uniqueArtists = new Set(
          recentTracks.body.items.map((item: any) => item.track.artists[0].name)
        );
        const discoveryScore = recentTracks.body.items.length > 0 
          ? Math.floor((uniqueArtists.size / recentTracks.body.items.length) * 100)
          : 0;

        const userData: SpotifyUserStats = {
          topArtist: topArtistDetails,
          minutesListened: estimatedMinutes,
          topGenre,
          tracksPlayed: currentMonthTracks.length,
          discoveryScore,
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
          })),
          savedTracks,
          playlistTracks,
          followedUserTracks
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

// Function to get random track from most played songs
export function useRandomTrackSelector() {
  const spotifyApi = useSpotify();

  const getRandomMostPlayedTrack = async (userData: SpotifyUserStats): Promise<TrackWithHistory | null> => {
    if (!userData) return null;

    try {
      console.log("Analyzing tracks for most played selection...");

      // Combine all tracks and count occurrences
      const trackMap = new Map<string, TrackWithHistory>();

      // Process recent tracks
      userData.recentTracks.forEach(item => {
        const trackId = item.track.name + item.track.artists[0].name; // Simple ID
        if (trackMap.has(trackId)) {
          const track = trackMap.get(trackId)!;
          track.play_count += 1;
          track.sources.push({
            type: 'recent',
            played_at: item.played_at
          });
        } else {
          trackMap.set(trackId, {
            id: trackId,
            name: item.track.name,
            artists: item.track.artists.map(artist => ({
              name: artist.name,
              id: '' // Recent tracks don't have artist IDs
            })),
            album: {
              images: item.track.album.images,
              name: item.track.album.name,
              id: '' // Recent tracks don't have album IDs
            },
            popularity: 0,
            duration_ms: 0,
            external_urls: item.track.external_urls,
            play_count: 1,
            sources: [{
              type: 'recent',
              played_at: item.played_at
            }]
          });
        }
      });

      // Process saved tracks
      userData.savedTracks.forEach(item => {
        const trackId = item.track.name + item.track.artists[0].name;
        if (trackMap.has(trackId)) {
          const track = trackMap.get(trackId)!;
          track.play_count += 0.5; // Weight saved tracks less than recent plays
          track.sources.push({
            type: 'saved',
            added_at: item.added_at
          });
        } else {
          trackMap.set(trackId, {
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists,
            album: item.track.album,
            popularity: item.track.popularity,
            duration_ms: item.track.duration_ms,
            external_urls: item.track.external_urls,
            play_count: 0.5,
            sources: [{
              type: 'saved',
              added_at: item.added_at
            }]
          });
        }
      });

      // Process playlist tracks
      userData.playlistTracks.forEach(item => {
        const trackId = item.track.name + item.track.artists[0].name;
        if (trackMap.has(trackId)) {
          const track = trackMap.get(trackId)!;
          track.play_count += 0.3; // Weight playlist tracks even less
          track.sources.push({
            type: 'playlist',
            source_name: item.playlist_name,
            added_at: item.added_at
          });
        } else {
          trackMap.set(trackId, {
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists,
            album: item.track.album,
            popularity: item.track.popularity,
            duration_ms: item.track.duration_ms,
            external_urls: item.track.external_urls,
            play_count: 0.3,
            sources: [{
              type: 'playlist',
              source_name: item.playlist_name,
              added_at: item.added_at
            }]
          });
        }
      });

      // Process followed user tracks
      userData.followedUserTracks.forEach(item => {
        const trackId = item.track.name + item.track.artists[0].name;
        if (trackMap.has(trackId)) {
          const track = trackMap.get(trackId)!;
          track.play_count += 0.2;
          track.sources.push({
            type: 'followed_user',
            source_name: `${item.user_name} - ${item.playlist_name}`
          });
        } else {
          trackMap.set(trackId, {
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists,
            album: item.track.album,
            popularity: item.track.popularity,
            duration_ms: item.track.duration_ms,
            external_urls: item.track.external_urls,
            play_count: 0.2,
            sources: [{
              type: 'followed_user',
              source_name: `${item.user_name} - ${item.playlist_name}`
            }]
          });
        }
      });

      // Sort by play count and take top 200
      const sortedTracks = Array.from(trackMap.values())
        .sort((a, b) => b.play_count - a.play_count)
        .slice(0, 200);

      console.log(`Found ${sortedTracks.length} most played tracks`);

      if (sortedTracks.length === 0) return null;

      // Randomly select one track
      const randomIndex = Math.floor(Math.random() * sortedTracks.length);
      const selectedTrack = sortedTracks[randomIndex];

      // Fetch audio features for the selected track
      try {
        if (selectedTrack.id && selectedTrack.id !== selectedTrack.name + selectedTrack.artists[0].name) {
          const audioFeatures = await spotifyApi.getAudioFeaturesForTrack(selectedTrack.id);
          selectedTrack.audio_features = {
            danceability: audioFeatures.body.danceability,
            energy: audioFeatures.body.energy,
            valence: audioFeatures.body.valence,
            tempo: audioFeatures.body.tempo,
            key: audioFeatures.body.key,
            mode: audioFeatures.body.mode,
            acousticness: audioFeatures.body.acousticness,
            instrumentalness: audioFeatures.body.instrumentalness,
            liveness: audioFeatures.body.liveness,
            speechiness: audioFeatures.body.speechiness
          };
        }
      } catch (audioFeaturesError) {
        console.warn("Failed to fetch audio features:", audioFeaturesError);
      }

      console.log("Selected random track:", selectedTrack.name, "with play count:", selectedTrack.play_count);
      return selectedTrack;

    } catch (err) {
      console.error('Error selecting random track:', err);
      return null;
    }
  };

  return { getRandomMostPlayedTrack };
}