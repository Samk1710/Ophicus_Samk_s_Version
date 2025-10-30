import { ISong } from '@/lib/models/GameSession';
import { generate } from '../generate';

export async function generateNebulaRiddle(intermediarySong: ISong): Promise<string> {
  console.log('[generateNebulaRiddle] Generating riddle for:', intermediarySong.name);

  const prompt = `
Write a poetic and musical riddle about the following song.
If the song is not in English, write it in the song’s original language and then return ONLY the English transliteration of the poem.

Song: ${intermediarySong.name}
Artist: ${intermediarySong.artists.join(', ')}

Use 6–8 lines that capture the song’s emotion, imagery, and story.
You may include a few lyrical hints or recognizable phrases from the song, but never mention the title directly.
Keep it artistic, heartfelt, and musical — reflecting the essence and emotion of the song.
Make it clear enough for someone familiar with the song to guess it.

End with a line such as:
"Which song am I?" or "What melody holds this truth?"

Return ONLY the English transliteration of the poem if it’s not in English, otherwise return the poem itself.
`;

  const riddle = await generate(prompt);
  console.log('[generateNebulaRiddle] Riddle generated');
  return riddle.trim();
}

export async function generateNebulaReward(cosmicSong: ISong): Promise<string> {
  console.log('[generateNebulaReward] Generating reward clue for cosmic song:', cosmicSong.name);

  const prompt = `
Write a poetic and musical clue about the following song.
If the song is not in English, write it in the song’s original language and then return ONLY the English transliteration of the poem.

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Use 6–8 lines that gently hint at the song’s mood, message, or theme.
You may include subtle lyrical echoes or emotional tones, but never reveal the title.
Keep it expressive, musical, and emotionally resonant — a poem that feels like the song itself.
Make it fairly easy for someone familiar with the song to recognize it.

End with a line such as:
"Which song am I?" or "What melody holds this truth?"

Return ONLY the English transliteration of the poem if it’s not in English, otherwise return the poem itself.
`;

  const reward = await generate(prompt);
  console.log('[generateNebulaReward] Reward generated');
  return reward.trim();
}

export async function generateNebulaPenalty(cosmicSong: ISong): Promise<string> {
  console.log('[generateNebulaPenalty] Generating misleading clue');

  const prompt = `
Write a poetic and musical riddle about the following song that feels beautiful but slightly harder to solve.
If the song is not in English, write it in the song’s original language and then return ONLY the English transliteration of the poem.

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Use 6–8 lines that describe the song’s tone, feeling, or story in a subtle and interpretive way.
It should still feel true to the song but not too revealing.
Include emotional hints or imagery related to the song’s essence, but avoid direct clues.
Keep it artistic, melodic, and expressive — not misleading, just gently obscure.

End with a line such as:
"Which song am I?" or "What melody holds this truth?"

Return ONLY the English transliteration of the poem if it’s not in English, otherwise return the poem itself.
`;

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
