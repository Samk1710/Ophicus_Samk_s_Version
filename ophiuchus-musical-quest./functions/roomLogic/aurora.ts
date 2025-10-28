import { ISong } from '@/lib/models/GameSession';
import { generate, generateAudio } from '../generate';

export interface AuroraEmotionalSituation {
  situation: string;  // e.g., "breakup", "first love", "crushing", "yearning", "adulting", "life is hard"
  audioText: string;
  audioUrl: string;
}

// Common emotional situations
const EMOTIONAL_SITUATIONS = [
  'heartbroken after a breakup',
  'experiencing first love',
  'crushing on someone',
  'yearning for someone far away',
  'struggling with adulting and life responsibilities',
  'feeling lost and searching for meaning',
  'celebrating a major achievement',
  'dealing with loneliness',
  'missing someone deeply',
  'feeling nostalgic about the past',
  'going through a difficult transition',
  'healing from emotional pain'
];

export async function generateAuroraEmotionalSituation(): Promise<AuroraEmotionalSituation> {
  console.log('[generateAuroraEmotionalSituation] Creating emotional scenario...');

  // Randomly select a situation
  const situation = EMOTIONAL_SITUATIONS[Math.floor(Math.random() * EMOTIONAL_SITUATIONS.length)];
  console.log('[generateAuroraEmotionalSituation] Selected situation:', situation);

  // Generate a realistic audio narrative for that situation
  const audioPrompt = `Create a short, emotional monologue (3-4 sentences, max 60 seconds when spoken) of someone going through this situation: ${situation}.

Make it:
- REALISTIC and RELATABLE - like a real person talking
- EMOTIONAL but not overdramatic
- Hint at the situation WITHOUT explicitly stating it
- Use natural, conversational language
- Show emotion through words and tone

Examples:
- For breakup: "I keep checking my phone even though I know they won't text. God, why is it so quiet here? Everything reminds me of them... I just want to stop feeling like this."
- For first job: "I can't believe I actually did it! Mom called and I tried to play it cool but I was literally jumping around my apartment. This is real, this is actually happening!"
- For adulting: "When did life get so... exhausting? Bills, groceries, work, repeat. I thought being an adult would feel different, you know? More... together."

Write ONLY the monologue, nothing else. Make it emotional and authentic.`;

  const audioText = await generate(audioPrompt);
  console.log('[generateAuroraEmotionalSituation] Audio text generated');
  console.log('[generateAuroraEmotionalSituation] Preview:', audioText.substring(0, 100) + '...');

  // Generate audio using TTS with appropriate emotional voice
  const characters = [
    { name: "Person", voice: "Charon" }  // Emotional, expressive voice
  ];

  const audioId = await generateAudio(audioText.trim(), characters);
  console.log('[generateAuroraEmotionalSituation] Audio generated, URL:', audioId);

  // audioId is now the public URL path like /audio/audio-uuid.wav
  const audioUrl = audioId;

  return {
    situation,
    audioText: audioText.trim(),
    audioUrl
  };
}

export async function scoreAuroraSongMatch(
  userGuessedSong: ISong,
  emotionalSituation: string,
  audioText: string
): Promise<{ score: number; feedback: string }> {
  console.log('[scoreAuroraSongMatch] Scoring song relevance to emotional situation');
  console.log('[scoreAuroraSongMatch] Guessed song:', userGuessedSong.name);
  console.log('[scoreAuroraSongMatch] Situation:', emotionalSituation);

  const prompt = `You are evaluating how well a song suggestion matches an emotional situation.

EMOTIONAL SITUATION: Someone is ${emotionalSituation}
THEIR WORDS: "${audioText}"

SUGGESTED SONG: "${userGuessedSong.name}" by ${userGuessedSong.artists.join(', ')}

Rate how appropriate and helpful this song suggestion is on a scale of 0-10:

Consider:
- Does the song's mood match the emotional state?
- Would this song help or comfort someone in this situation?
- Is the lyrical content relevant?
- Does the energy level match what they might need?

Examples:
- "The Night We Met" by Lord Huron for someone crying after a breakup: 9-10 (perfect match - melancholic, nostalgic, about lost love)
- "Jingle Bells" for someone crying after a breakup: 1-2 (terrible match - upbeat, holiday cheer, completely wrong mood)
- "Happy" by Pharrell for someone celebrating first job: 9-10 (great match - joyful, celebratory)
- "Hurt" by Johnny Cash for celebrating first job: 2-3 (wrong mood - dark and painful)

Return your response in this EXACT format:
SCORE: [0-10]
FEEDBACK: [One sentence explaining why this score - be honest and specific]`;

  const response = await generate(prompt);
  console.log('[scoreAuroraSongMatch] AI response:', response);

  // Parse the response
  const scoreMatch = response.match(/SCORE:\s*(\d+)/i);
  const feedbackMatch = response.match(/FEEDBACK:\s*(.+)/i);

  const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : "Song evaluated based on emotional resonance.";

  console.log('[scoreAuroraSongMatch] Final score:', score);
  console.log('[scoreAuroraSongMatch] Feedback:', feedback);

  return {
    score: Math.max(0, Math.min(10, score)),
    feedback
  };
}

export async function generateAuroraReward(cosmicSong: ISong, score: number): Promise<string> {
  console.log('[generateAuroraReward] Generating Aurora clue based on score:', score);

  // Only give clue if score >= 7
  if (score < 7) {
    return "The aurora's light dims... your suggestion did not resonate with the cosmic frequency.";
  }

  const prompt = `Create a mystical, poetic clue about this song focusing on its EMOTIONAL RESONANCE:

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

The clue should:
- Hint at the FEELING or MOOD of the song
- Be celestial and mystical
- Be 1-2 sentences
- NOT mention the title or artist
- Help the player understand what kind of emotion to look for

Example: "The cosmic song carries the weight of bittersweet memories, a melody that speaks to hearts that have loved and lost."

Return ONLY the clue text, nothing else.`;

  const reward = await generate(prompt);
  console.log('[generateAuroraReward] Reward clue generated');
  return reward.trim();
}
