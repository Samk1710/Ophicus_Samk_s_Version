import { SpotifyUserStats } from '@/hooks/useSpotifyUserData';
import { ISong } from '@/lib/models/GameSession';
import { generate } from '../generate';

export interface NovaQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  type: 'multiple-choice' | 'text';
}

export async function generateNovaQuestions(
  userData: SpotifyUserStats,
  cosmicSong: ISong
): Promise<NovaQuestion[]> {
  console.log('[generateNovaQuestions] Generating memory quiz questions');

  const questions: NovaQuestion[] = [];

  // Question 1: Top artist
  if (userData.topArtist) {
    questions.push({
      id: 'top-artist',
      question: 'Which artist have you streamed the most recently?',
      type: 'text',
      correctAnswer: userData.topArtist.name
    });
  }

  // Question 2: Top genre
  if (userData.topGenre) {
    const genres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', userData.topGenre];
    const uniqueGenres = [...new Set(genres)].slice(0, 4);
    
    questions.push({
      id: 'top-genre',
      question: 'What genre dominated your recent listening?',
      options: uniqueGenres,
      type: 'multiple-choice',
      correctAnswer: userData.topGenre
    });
  }

  // Question 3: Recent track
  if (userData.recentTracks.length > 0) {
    const recentTrack = userData.recentTracks[0];
    const otherTracks = userData.topTracks.slice(0, 3).map(t => t.name);
    const options = [recentTrack.track.name, ...otherTracks].slice(0, 4);
    
    questions.push({
      id: 'recent-track',
      question: 'Which song did you listen to most recently?',
      options: [...new Set(options)],
      type: 'multiple-choice',
      correctAnswer: recentTrack.track.name
    });
  }

  // Question 4: Lyric completion (about cosmic song)
  const lyricPrompt = `Create a fill-in-the-blank lyric question for this song:

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Format: "Complete the lyric: '[first part] _____'"
The blank should be a memorable word or phrase from the song.

Return ONLY the question text with the blank represented as _____, nothing else.`;

  const lyricQuestion = await generate(lyricPrompt);
  const lyricAnswer = await generate(`What word/phrase fills the blank in: ${lyricQuestion}\n\nFor song: ${cosmicSong.name}\n\nReturn ONLY the answer word/phrase.`);
  
  questions.push({
    id: 'lyric-complete',
    question: lyricQuestion.trim(),
    type: 'text',
    correctAnswer: lyricAnswer.trim()
  });

  // Question 5: Time of day listening
  const timeQuestion = {
    id: 'listening-time',
    question: 'When do you usually play music?',
    options: ['Morning', 'Afternoon', 'Evening', 'Late Night'],
    type: 'multiple-choice' as const,
    correctAnswer: 'Evening' // Default, could be calculated from recent plays
  };
  
  questions.push(timeQuestion);

  console.log('[generateNovaQuestions]', questions.length, 'questions generated');
  return questions.slice(0, 5); // Return exactly 5 questions
}

export function scoreNovaAnswers(
  userAnswers: Record<string, string>,
  questions: NovaQuestion[]
): number {
  console.log('[scoreNovaAnswers] Scoring answers');
  
  let correct = 0;
  questions.forEach(q => {
    const userAnswer = userAnswers[q.id]?.toLowerCase().trim();
    const correctAnswer = q.correctAnswer.toLowerCase().trim();
    
    if (userAnswer === correctAnswer || userAnswer?.includes(correctAnswer) || correctAnswer.includes(userAnswer || '')) {
      correct++;
      console.log('[scoreNovaAnswers] Question', q.id, 'CORRECT');
    } else {
      console.log('[scoreNovaAnswers] Question', q.id, 'INCORRECT:', userAnswer, 'vs', correctAnswer);
    }
  });

  console.log('[scoreNovaAnswers] Score:', correct, '/', questions.length);
  return correct;
}

export async function generateNovaReward(
  cosmicSong: ISong,
  score: number
): Promise<{ type: string; content: string }> {
  console.log('[generateNovaReward] Generating reward for score:', score);

  if (score === 5) {
    // Full score: humming or muffled chorus
    const prompt = `Describe what a hummed or muffled version of this song's chorus would sound like:

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Describe the melody pattern in words (like "da da dum, da da dum dum").
Keep it to one line.

Return ONLY the description, nothing else.`;

    const content = await generate(prompt);
    return { type: 'audio-description', content: content.trim() };
  } else if (score === 4) {
    // 4 correct: fragmented reversed audio description
    return {
      type: 'reversed-audio',
      content: 'A fragmented melody plays backward, echoing through the cosmic void...'
    };
  } else if (score === 3) {
    // 3 correct: encrypted lyric
    const prompt = `Create an encrypted/scrambled version of a lyric from this song:

Song: ${cosmicSong.name}

Take a memorable lyric and scramble the letters or use a simple cipher.

Return ONLY the encrypted lyric, nothing else.`;

    const content = await generate(prompt);
    return { type: 'encrypted-lyric', content: content.trim() };
  } else {
    // Less than 3: genre hint or mood cue
    const prompt = `Provide a subtle genre and mood hint for this song:

Song: ${cosmicSong.name}
Artist: ${cosmicSong.artists.join(', ')}

Format: "Genre: [genre] | Mood: [mood]"

Return ONLY this formatted hint, nothing else.`;

    const content = await generate(prompt);
    return { type: 'genre-mood-hint', content: content.trim() };
  }
}
