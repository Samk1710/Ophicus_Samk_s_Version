import { ISong } from '@/lib/models/GameSession';
import { generate, generateAudio } from '../generate';

export interface AuroraVignette {
  text: string;
  audioId: string; // ID for the generated audio file
  emotion: string; // The emotion (not shown to player)
}

export async function generateAuroraVignette(cosmicSong: ISong): Promise<AuroraVignette> {
  console.log('[generateAuroraVignette] Generating emotional vignette for:', cosmicSong.name);

  // First, identify the song's primary emotion
  const emotionPrompt = `Identify the primary emotion or mood of this song in ONE WORD:

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Return ONLY one word describing the dominant emotion (examples: joy, melancholy, longing, excitement, nostalgia, heartbreak, empowerment, peace).`;

  const emotion = (await generate(emotionPrompt)).trim().toLowerCase();
  console.log('[generateAuroraVignette] Identified emotion:', emotion);

  // Generate a short emotional story/vignette
  const vignettePrompt = `Create a short, emotional spoken narrative (2-3 sentences) that captures the feeling of this song without mentioning the title or artist:

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}
Emotion: ${emotion}

Write it as a personal memory or scenario told in first person.
Make it evocative and emotional but don't mention the song.
The vignette should make someone FEEL the same emotion as the song.

Example: "I remember driving down that empty highway at 2 AM, windows down, feeling like I could finally breathe again. Everything that had been weighing on me just... lifted. For the first time in months, I smiled at nothing in particular."

Return ONLY the narrative text, nothing else.`;

  const vignetteText = await generate(vignettePrompt);
  console.log('[generateAuroraVignette] Vignette text generated');

  // Generate audio using multi-speaker TTS
  const characters = [
    { name: "Narrator", voice: "Charon" }
  ];

  const audioId = await generateAudio(vignetteText, characters);
  console.log('[generateAuroraVignette] Audio generated with ID:', audioId);

  return {
    text: vignetteText.trim(),
    audioId,
    emotion
  };
}

export async function scoreAuroraMatch(
  userGuess: ISong,
  cosmicSong: ISong,
  targetEmotion: string
): Promise<number> {
  console.log('[scoreAuroraMatch] Scoring emotional match');
  console.log('[scoreAuroraMatch] User guess:', userGuess.name);
  console.log('[scoreAuroraMatch] Target emotion:', targetEmotion);

  const prompt = `Score how well this song matches the emotional vibe described.

Guessed Song: ${userGuess.name} by ${userGuess.artists.join(', ')}
Target Emotion: ${targetEmotion}
Cosmic Song (for reference): ${cosmicSong.name} by ${cosmicSong.artists.join(', ')}

Rate the emotional similarity on a scale of 1-10.
Consider mood, energy, themes, and emotional resonance.

Return ONLY a number between 1 and 10, nothing else.`;

  const scoreText = await generate(prompt);
  const score = parseInt(scoreText.trim());
  
  console.log('[scoreAuroraMatch] Score:', score);
  return isNaN(score) ? 5 : Math.max(1, Math.min(10, score));
}

export async function generateAuroraReward(cosmicSong: ISong, score: number): Promise<string> {
  console.log('[generateAuroraReward] Generating mood-aligned clue');

  const prompt = `Create a mood or emotion-based clue about this song:

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Create a mystical 1-2 line clue that hints at the emotional journey or feeling of the song.
Make it poetic and celestial.

Return ONLY the clue text, nothing else.`;

  const reward = await generate(prompt);
  console.log('[generateAuroraReward] Reward generated');
  return reward.trim();
}
