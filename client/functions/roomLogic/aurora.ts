import { ISong } from '@/lib/models/GameSession';
import { generate, generateAudio } from '../generate';

export interface AuroraEmotionalSituation {
  situation: string;  // e.g., "breakup", "first love", "crushing", "yearning", "adulting", "life is hard"
  audioText: string;
  audioUrl: string;
}

// Expanded emotional situations — covering broader emotional spectrum
const EMOTIONAL_SITUATIONS = [
  // Love & Relationships
  'heartbroken after a breakup',
  'experiencing first love',
  'crushing on someone',
  'yearning for someone far away',
  'feeling unloved in a relationship',
  'trying to move on but still in love',
  'realizing you fell for your best friend',
  'waiting for someone who might never come back',
  'being in a long-distance relationship',
  'finally confessing your feelings',
  'watching someone you love fall for someone else',
  'getting over a toxic ex',
  'questioning if love was ever real',
  'feeling invisible to the one you like',

  // Growth & Life
  'struggling with adulting and life responsibilities',
  'feeling lost and searching for meaning',
  'trying to figure out who you are',
  'recovering from burnout',
  'feeling stuck in a routine',
  'starting a new chapter in life',
  'graduating and not knowing what’s next',
  'facing rejection and self-doubt',
  'finally finding your purpose',
  'overcoming fear of failure',
  'starting over in a new city',
  'healing from emotional pain',
  'finally learning to love yourself',

  // Nostalgia & Reflection
  'feeling nostalgic about the past',
  'missing how things used to be',
  'remembering childhood innocence',
  'missing someone deeply',
  'revisiting old places and memories',
  'feeling like time is slipping away',
  'looking through old photos',
  'feeling bittersweet about growing up',
  'missing the simplicity of youth',

  // Loneliness & Mental Struggle
  'dealing with loneliness',
  'feeling isolated even around people',
  'pretending to be okay when you’re not',
  'feeling like no one understands you',
  'overthinking late at night',
  'wanting to disappear for a while',
  'feeling like you’re not enough',
  'carrying emotional baggage silently',
  'fighting with your own thoughts',

  // Hope & Triumph
  'celebrating a major achievement',
  'finally finding peace after chaos',
  'falling in love with life again',
  'forgiving someone who hurt you',
  'forgiving yourself for past mistakes',
  'learning to let go of control',
  'feeling proud after overcoming something hard',
  'embracing change instead of fearing it',
  'starting to believe in yourself again'
];

export async function generateAuroraEmotionalSituation(): Promise<AuroraEmotionalSituation> {
  console.log('[generateAuroraEmotionalSituation] Creating emotional scenario...');

  // Randomly select a situation
  const situation = EMOTIONAL_SITUATIONS[Math.floor(Math.random() * EMOTIONAL_SITUATIONS.length)];
  console.log('[generateAuroraEmotionalSituation] Selected situation:', situation);

  // Generate a realistic audio narrative for that situation
  const audioPrompt = `Create a short, emotional monologue (3-4 sentences, max 60 seconds when spoken) of someone going through this situation: ${situation}.

Make it:
- REALISTIC and RELATABLE — like a real person talking to themselves or a close friend
- EMOTIONAL but not overdramatic
- Hint at the situation WITHOUT explicitly stating it
- Use natural, conversational language
- Show emotion through tone, pauses, and choice of words

Examples:
- Breakup: "I keep checking my phone even though I know they won’t text. It's like my mind’s on repeat — every song, every street, it’s all them. I just wish it would stop hurting for one night."
- First Love: "They smiled and suddenly, everything felt... new. Like I’d been living in grayscale until now. How do you even explain that feeling? It’s ridiculous and perfect at the same time."
- Adulting: "No one tells you how quiet life gets when you’re just... doing what you’re supposed to. Work, bills, sleep, repeat. Sometimes I wonder if this is what growing up really means — learning to keep going anyway."
- Loneliness: "I’ve been scrolling for hours but nothing feels right. Everyone looks so happy, and I just... I can’t remember the last time I really laughed like that."
- Nostalgia: "It’s weird, isn’t it? How a song can take you back years in a heartbeat. Suddenly you’re sixteen again, laughing about nothing, and for a moment — everything feels whole."
- Hope after pain: "I thought I’d never feel light again, but here it is — quiet, gentle, real. Maybe healing isn’t loud. Maybe it’s just breathing without breaking."

Write ONLY the monologue, nothing else. Make it raw, emotional, and human.`;

  const audioText = await generate(audioPrompt);
  console.log('[generateAuroraEmotionalSituation] Audio text generated');
  console.log('[generateAuroraEmotionalSituation] Preview:', audioText.substring(0, 100) + '...');

  // Generate audio using TTS with appropriate emotional voice
  // Available voices: Puck, Charon, Kore, Fenrir, Aoede
  // Charon is warm and expressive - perfect for emotional scenarios
  const audioUrl = await generateAudio(audioText.trim(), 'Charon');
  console.log('[generateAuroraEmotionalSituation] Audio generated, URL:', audioUrl);

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

Rate how appropriate and emotionally resonant this song is on a scale of 0-10.

Consider:
- Does the song’s mood align with the emotional tone?
- Would listening to this song help or comfort the person?
- Are the lyrics and energy fitting for this emotional state?
- Does it feel emotionally authentic?

Examples:
- "The Night We Met" by Lord Huron for someone crying after a breakup: 10 (haunting, emotional, perfectly fits heartbreak)
- "Jingle Bells" for someone crying after a breakup: 1 (cheerful, opposite mood)
- "Happy" by Pharrell for someone celebrating a first job: 9 (bright, joyful, uplifting)
- "Hurt" by Johnny Cash for celebrating a first job: 2 (somber, off-tone)
- "Let It Be" by The Beatles for someone learning to heal: 9 (gentle, comforting, wise)

Return your response in this EXACT format:
SCORE: [0-10]
FEEDBACK: [One sentence explaining why this score - honest, emotional, and specific]`;

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
- Capture the song’s emotional essence or the feeling it leaves behind
- Be celestial and mystical in tone
- Use metaphors of light, time, and emotion
- Be 1-2 sentences long
- NOT mention the title or artist
- Help the listener understand the emotional soul of the song

Example: "This melody feels like a sunrise after long nights — quiet, hopeful, and full of soft healing."

Return ONLY the clue text, nothing else.`;

  const reward = await generate(prompt);
  console.log('[generateAuroraReward] Reward clue generated');
  return reward.trim();
}
