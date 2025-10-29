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
): Promise<{ title: string; description: string; imageUrl: string }> {
  console.log('[generateOphiuchusIdentity] Generating Ophiuchus identity');

  const prompt = `Based on this cosmic song and the user's musical journey, create a unique Ophiuchus zodiac identity.

Cosmic Song: ${cosmicSong.name} by ${cosmicSong.artists.join(', ')}
Musical Profile: ${userMusicProfile}

Create a mystical identity in JSON format with the following structure:
{
  "title": "Ophiuchus of the [poetic descriptor]",
  "description": "A detailed mystical description of the user's musical soul, 2-3 sentences",
  "imageUrl": ""
}

Example:
{
  "title": "Ophiuchus of the Quiet Chorus",
  "description": "A soul born of friendship's echo, craving visibility through melody. Your cosmic journey reveals a spirit that seeks connection through the universal language of music.",
  "imageUrl": ""
}

Return ONLY valid JSON, no additional text.`;

  const response = await generate(prompt);
  console.log('[generateOphiuchusIdentity] Raw response:', response);
  
  // Parse the response using parseUntilJson to handle any formatting issues
  const identity = parseUntilJson(response) as { title: string; description: string; imageUrl: string };
  
  // Ensure required fields exist
  if (!identity.title || !identity.description) {
    console.warn('[generateOphiuchusIdentity] Missing fields, using defaults');
    return {
      title: identity.title || "Ophiuchus of the Celestial Harmonist",
      description: identity.description || "A soul blessed by the 13th constellation, forever seeking cosmic truth through music.",
      imageUrl: identity.imageUrl || cosmicSong.imageUrl || ""
    };
  }
  
  // Use cosmic song image as default if no image URL provided
  if (!identity.imageUrl) {
    identity.imageUrl = cosmicSong.imageUrl || "";
  }
  
  console.log('[generateOphiuchusIdentity] Identity generated:', identity);
  
  return identity;
}
