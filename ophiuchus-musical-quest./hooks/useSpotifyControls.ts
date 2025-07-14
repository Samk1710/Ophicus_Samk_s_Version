import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useSpotifyControls() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const play = useCallback(async (contextUri?: string, uris?: string[]) => {
    if (!session?.user?.accessToken) return;

    try {
      const options: any = {};
      if (contextUri) options.context_uri = contextUri;
      if (uris) options.uris = uris;

      await spotifyApi.play(options);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }, [spotifyApi, session?.user?.accessToken]);

  const pause = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    try {
      await spotifyApi.pause();
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  }, [spotifyApi, session?.user?.accessToken]);

  const skipToNext = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    try {
      await spotifyApi.skipToNext();
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  }, [spotifyApi, session?.user?.accessToken]);

  const skipToPrevious = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    try {
      await spotifyApi.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  }, [spotifyApi, session?.user?.accessToken]);

  const toggleShuffle = useCallback(async (state: boolean) => {
    if (!session?.user?.accessToken) return;

    try {
      await spotifyApi.setShuffle(state);
    } catch (error) {
      console.error('Error toggling shuffle:', error);
    }
  }, [spotifyApi, session?.user?.accessToken]);

  const setVolume = useCallback(async (volume: number) => {
    if (!session?.user?.accessToken) return;

    try {
      await spotifyApi.setVolume(volume);
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }, [spotifyApi, session?.user?.accessToken]);

  const addToQueue = useCallback(async (uri: string) => {
    if (!session?.user?.accessToken) return;

    try {
      await spotifyApi.addToQueue(uri);
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  }, [spotifyApi, session?.user?.accessToken]);

  const saveTrack = useCallback(async (trackId: string) => {
    if (!session?.user?.accessToken) return;

    try {
      await spotifyApi.addToMySavedTracks([trackId]);
    } catch (error) {
      console.error('Error saving track:', error);
    }
  }, [spotifyApi, session?.user?.accessToken]);

  const removeTrack = useCallback(async (trackId: string) => {
    if (!session?.user?.accessToken) return;

    try {
      await spotifyApi.removeFromMySavedTracks([trackId]);
    } catch (error) {
      console.error('Error removing track:', error);
    }
  }, [spotifyApi, session?.user?.accessToken]);

  return {
    play,
    pause,
    skipToNext,
    skipToPrevious,
    toggleShuffle,
    setVolume,
    addToQueue,
    saveTrack,
    removeTrack
  };
}
