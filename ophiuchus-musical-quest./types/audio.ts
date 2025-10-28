/**
 * Audio generation types for the Ophiuchus Musical Quest
 */

/**
 * Available Gemini TTS voices
 * - Puck: Youthful, energetic
 * - Charon: Warm, expressive, emotional
 * - Kore: Clear, articulate
 * - Fenrir: Deep, resonant
 * - Aoede: Melodic, sing-song
 */
export type GeminiVoice = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Aoede';

/**
 * Audio generation configuration
 */
export interface AudioConfig {
  voice: GeminiVoice;
  prompt: string;
}

/**
 * Audio generation result from Cloudinary
 */
export interface AudioResult {
  url: string;
  publicId: string;
  secureUrl: string;
}

/**
 * Emotional situation for Aurora room
 */
export interface EmotionalSituation {
  situation: string;
  audioText: string;
  audioUrl: string;
}
