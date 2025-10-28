import { ISong } from '@/lib/models/GameSession';
import { generate } from '../generate';

export async function generateNebulaRiddle(intermediarySong: ISong): Promise<string> {
  console.log('[generateNebulaRiddle] Generating riddle for:', intermediarySong.name);

  const prompt = `Create a mysterious, poetic riddle about this song without revealing its title directly.

Song: ${intermediarySong.name}
Artist: ${intermediarySong.artists.join(', ')}

The riddle should be evocative, cryptic, and lead the player to guess the song.
Use metaphors, imagery, and emotional themes from the song.
Format it as a 4-8 line poem with a mystical, celestial tone.
End with a question like "Which song am I?" or "What melody holds this truth?"

Return ONLY the riddle text, nothing else.`;

  const riddle = await generate(prompt);
  console.log('[generateNebulaRiddle] Riddle generated');
  return riddle.trim();
}

export async function generateNebulaReward(cosmicSong: ISong): Promise<string> {
  console.log('[generateNebulaReward] Generating reward clue for cosmic song:', cosmicSong.name);

  const prompt = `Create a poetic riddle clue about this song (the main cosmic song) that provides helpful hints without being too obvious.

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Create a mystical, 2-4 line clue that hints at the song's themes, mood, or story.
Make it celestial and evocative.

Return ONLY the clue text, nothing else.`;

  const reward = await generate(prompt);
  console.log('[generateNebulaReward] Reward generated');
  return reward.trim();
}

export async function generateNebulaPenalty(cosmicSong: ISong): Promise<string> {
  console.log('[generateNebulaPenalty] Generating misleading clue');

  const prompt = `Create a slightly misleading but poetic clue about this song that could apply to multiple songs.

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Create a vague, 1-2 line mystical clue that is somewhat true but not very helpful.

Return ONLY the clue text, nothing else.`;

  const penalty = await generate(prompt);
  console.log('[generateNebulaPenalty] Penalty generated');
  return penalty.trim();
}

export function checkNebulaGuess(guessedTrackId: string, correctSong: ISong): boolean {
  // Compare Spotify IDs directly
  console.log('[checkNebulaGuess] Comparing Spotify IDs:');
  console.log('[checkNebulaGuess] Guessed ID:', guessedTrackId);
  console.log('[checkNebulaGuess] Correct ID:', correctSong.id);
  
  const isCorrect = guessedTrackId === correctSong.id;
  console.log('[checkNebulaGuess] Match:', isCorrect);
  
  return isCorrect;
}
