import { ISong } from '@/lib/models/GameSession';
import { generate } from '../generate';

export interface CometLyricFlash {
  lyric: string;
  duration: number; // in seconds
}

export async function generateCometLyric(intermediarySong: ISong): Promise<CometLyricFlash> {
  console.log('[generateCometLyric] Generating lyric flash for:', intermediarySong.name);

const prompt = `
Extract one authentic, memorable lyric line from the following song.

Song: ${intermediarySong.name}
Artist: ${intermediarySong.artists.join(', ')}

Guidelines:
- The line should be taken directly from the song’s actual lyrics if possible.
- Try your absolute best to recall or identify the exact lyric — do not give up easily.
- Only if you are less than 30% confident about the real lyric, then create a line that feels completely believable and stylistically identical to the artist’s tone and the song’s theme.
- The line must sound like something that truly belongs in that song.
- Keep it concise: one line, maximum 15 words.
- Do NOT include quotation marks, commentary, or any extra text.

Return ONLY the lyric line, nothing else.
`;


  const lyric = await generate(prompt);
  console.log('[generateCometLyric] Lyric generated:', lyric.trim());
  
  return {
    lyric: lyric.trim(),
    duration: 10 // 10 seconds to see the lyric
  };
}

export function checkCometGuess(guessedTrackId: string, correctSong: ISong): boolean {
  // Compare Spotify IDs directly
  console.log('[checkCometGuess] Comparing Spotify IDs:');
  console.log('[checkCometGuess] Guessed ID:', guessedTrackId);
  console.log('[checkCometGuess] Correct ID:', correctSong.id);
  
  const isCorrect = guessedTrackId === correctSong.id;
  console.log('[checkCometGuess] Match:', isCorrect);
  
  return isCorrect;
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
