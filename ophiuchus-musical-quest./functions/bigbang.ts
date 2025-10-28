import { TrackWithHistory } from '@/hooks/useSpotifyUserData';
import { ISong } from '@/lib/models/GameSession';
import { generate } from './generate';
import { parseUntilJson } from './parseUntilJSON';

export interface BigBangResult {
  cosmicSong: ISong;
  intermediarySongs: ISong[];
  initialClue: string;
}

function convertToISong(track: TrackWithHistory): ISong {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists.map(a => a.name),
    album: track.album.name,
    imageUrl: track.album.images[0]?.url || '',
    spotifyUrl: track.external_urls?.spotify
  };
}

function selectRandomTracks(tracks: TrackWithHistory[], count: number): TrackWithHistory[] {
  console.log('[selectRandomTracks] Selecting', count, 'tracks from', tracks.length, 'available tracks');
  
  if (tracks.length <= count) {
    console.log('[selectRandomTracks] Not enough tracks, returning all');
    return tracks;
  }

  const selected: TrackWithHistory[] = [];
  const usedIndices = new Set<number>();

  while (selected.length < count) {
    const randomIndex = Math.floor(Math.random() * tracks.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selected.push(tracks[randomIndex]);
      console.log('[selectRandomTracks] Selected track:', tracks[randomIndex].name, 'by', tracks[randomIndex].artists[0]?.name);
    }
  }

  return selected;
}

export async function initializeBigBang(tracks: TrackWithHistory[]): Promise<BigBangResult> {
  console.log('[initializeBigBang] Starting Big Bang with', tracks.length, 'tracks');

  if (tracks.length < 3) {
    console.error('[initializeBigBang] Not enough tracks to start game');
    throw new Error('Not enough tracks in user library. Need at least 3 tracks.');
  }

  // Select 3 random songs
  const selectedTracks = selectRandomTracks(tracks, 3);
  console.log('[initializeBigBang] Selected 3 tracks for the game');

  // Randomly choose one as the cosmic song (main song to guess)
  const cosmicSongIndex = Math.floor(Math.random() * 3);
  const cosmicSongTrack = selectedTracks[cosmicSongIndex];
  const intermediaryTracks = selectedTracks.filter((_, index) => index !== cosmicSongIndex);

  console.log('[initializeBigBang] Cosmic Song:', cosmicSongTrack.name, 'by', cosmicSongTrack.artists[0]?.name);
  console.log('[initializeBigBang] Intermediary Songs:', intermediaryTracks.map(t => t.name).join(', '));

  // Generate initial poetic clue about the cosmic song
  const cluePrompt = `Create a mysterious, poetic one-line clue about this song without revealing the title or artist name directly:

Song: ${cosmicSongTrack.name}
Artist: ${cosmicSongTrack.artists.map(a => a.name).join(', ')}

The clue should be evocative and cryptic, hinting at the song's themes, mood, or story. 
Make it sound celestial and mystical.
Keep it to one sentence, maximum 20 words.

Example format: "She stood on the bleachers while love climbed rooftops without her."

Return ONLY the clue text, nothing else.`;

  console.log('[initializeBigBang] Generating initial clue...');
  const initialClue = await generate(cluePrompt);
  console.log('[initializeBigBang] Initial clue generated:', initialClue);

  const result = {
    cosmicSong: convertToISong(cosmicSongTrack),
    intermediarySongs: intermediaryTracks.map(convertToISong),
    initialClue: initialClue.trim()
  };

  console.log('[initializeBigBang] Big Bang initialization complete');
  return result;
}

export async function generateOphiuchusIdentity(
  cosmicSong: ISong,
  userMusicProfile: string
): Promise<string> {
  console.log('[generateOphiuchusIdentity] Generating Ophiuchus identity');

  const prompt = `Based on this cosmic song and the user's musical journey, create a unique Ophiuchus zodiac identity.

Cosmic Song: ${cosmicSong.name} by ${cosmicSong.artists.join(', ')}
Musical Profile: ${userMusicProfile}

Create a mystical identity title that reflects the essence of this song and the user's connection to it.

Format: "Ophiuchus of the [poetic descriptor] — [one sentence about their musical soul]"

Example: "Ophiuchus of the Quiet Chorus — a soul born of friendship's echo, craving visibility through melody."

Return ONLY the identity text, nothing else.`;

  const identity = await generate(prompt);
  console.log('[generateOphiuchusIdentity] Identity generated:', identity);
  
  return identity.trim();
}
