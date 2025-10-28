import { ISong } from '@/lib/models/GameSession';
import { generate } from '../generate';

export interface CometLyricFlash {
  lyric: string;
  duration: number; // in seconds
}

export async function generateCometLyric(intermediarySong: ISong): Promise<CometLyricFlash> {
  console.log('[generateCometLyric] Generating lyric flash for:', intermediarySong.name);

  const prompt = `Extract or create a memorable, distinctive lyric line from this song:

Song: ${intermediarySong.name}
Artist: ${intermediarySong.artists.join(', ')}

Return ONLY one lyric line that is distinctive and memorable from this song.
If you don't know the exact lyrics, create a line that captures the song's essence.
Keep it to one line, maximum 15 words.

Return ONLY the lyric text, nothing else.`;

  const lyric = await generate(prompt);
  console.log('[generateCometLyric] Lyric generated:', lyric.trim());
  
  return {
    lyric: lyric.trim(),
    duration: 10 // 10 seconds to see the lyric
  };
}

export function checkCometGuess(guess: string, correctSong: ISong): boolean {
  const normalizedGuess = guess.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const normalizedSong = correctSong.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  
  console.log('[checkCometGuess] Comparing:', normalizedGuess, 'vs', normalizedSong);
  return normalizedGuess === normalizedSong;
}

export async function generateCometReward(cosmicSong: ISong): Promise<string> {
  console.log('[generateCometReward] Generating lyric reward from cosmic song');

  const prompt = `Extract or create a memorable lyric line from this song:

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Return ONLY one distinctive lyric line from this song.
If you don't know the exact lyrics, create a line that captures the song's essence.
Keep it to one line, maximum 15 words.

Return ONLY the lyric text, nothing else.`;

  const reward = await generate(prompt);
  console.log('[generateCometReward] Reward lyric generated');
  return reward.trim();
}
