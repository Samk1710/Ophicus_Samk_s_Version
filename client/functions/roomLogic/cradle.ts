import { ISong } from '@/lib/models/GameSession';
import { generate } from '../generate';

export async function generateArtistClue(artist: string): Promise<string> {
  console.log('[generateArtistClue] Generating identity clue for artist:', artist);

  const prompt = `Create a mysterious, poetic identity clue about this music artist without revealing their name directly.

Artist: ${artist}

Create a mystical, 2-3 line clue that hints at their style, achievements, background, or impact.
Make it celestial and evocative, fitting the cosmic theme.

Example: "She writes with glitter and burns with folklore. She was once 15, and now she haunts her own eras."

Return ONLY the clue text, nothing else.`;

  const clue = await generate(prompt);
  console.log('[generateArtistClue] Artist clue generated');
  return clue.trim();
}

export async function answerArtistQuestion(question: string, artist: string): Promise<string> {
  console.log('[answerArtistQuestion] Answering question about:', artist);
  console.log('[answerArtistQuestion] Question:', question);

  const prompt = `You are a mystical Cosmic Oracle who knows about this music artist: ${artist}

The seeker asks: "${question}"

Answer the question in a Gandalf-style manner - be cryptic yet helpful, never revealing the artist's name directly.
Provide factual information (like number of Grammys, genre, collaborations, career milestones) but in a mystical, poetic way.

Keep your answer to 1-3 sentences.
Use phrases like "This artist...", "They have...", "Their music..." instead of names.

Return ONLY your mystical answer, nothing else.`;

  const answer = await generate(prompt);
  console.log('[answerArtistQuestion] Answer generated');
  return answer.trim();
}

export function checkArtistGuess(guess: string, correctArtist: string): boolean {
  const normalizedGuess = guess.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const normalizedArtist = correctArtist.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  
  console.log('[checkArtistGuess] Comparing:', normalizedGuess, 'vs', normalizedArtist);
  return normalizedGuess === normalizedArtist;
}

export async function generateArtistReward(cosmicSong: ISong): Promise<string> {
  console.log('[generateArtistReward] Generating reward for correct artist guess');

  const prompt = `Create a helpful clue about this song that reveals information about the artist.

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Create a mystical 1-2 line clue that connects the artist to the song.

Return ONLY the clue text, nothing else.`;

  const reward = await generate(prompt);
  console.log('[generateArtistReward] Reward generated');
  return reward.trim();
}
