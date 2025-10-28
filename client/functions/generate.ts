import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI, Modality } from "@google/genai";
import wav from 'wav';
import path from 'path';
import { uploadAudioFromBuffer } from '@/lib/cloudinary';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyANqqfDccgTgAR0YEEKuT9LVELZ5eF10Tc';

export const generate = async (prompt: string) => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Try with gemini-2.0-flash first, fallback to gemini-1.5-flash if overloaded
    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
    let lastError = null;
    
    for (const modelName of models) {
        try {
            console.log(`[generate] Attempting with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            console.log(`[generate] Success with ${modelName}`);
            return text;
        } catch (error) {
            console.error(`[generate] Error with ${modelName}:`, error);
            lastError = error;
            
            // If it's a 503 error and we have more models to try, continue
            if (error instanceof Error && error.message.includes('503') && modelName !== models[models.length - 1]) {
                console.log(`[generate] ${modelName} overloaded, trying fallback...`);
                continue;
            }
            
            // For other errors or last model, throw
            if (modelName === models[models.length - 1]) {
                break;
            }
        }
    }
    
    console.error('Error generating response with Gemini:', lastError);
    throw lastError;
}

export const generateWithImage = async (prompt: string, image?: File) => {
    const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const imagePart = image
      ? {
          inlineData: {
            mimeType: image.type,
            data: Buffer.from(await image.arrayBuffer()).toString("base64"),
          },
        }
      : null;

    const contents = [imagePart, { text: prompt }].filter(Boolean) as any[];

    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents
    });
    if (result.text) {
        return result.text;
    }
    console.error(result);
    console.error("No text in the response");
    throw new Error("No text in the response");
}

export const generateImage = async (prompt: string): Promise<Blob> => {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const contents = prompt;

  // Set responseModalities to include "Image" so the model can generate an image
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    // Based on the part type, either show the text or return the image as blob
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data || '';
      const buffer = Buffer.from(imageData, "base64");
      return new Blob([buffer], { type: 'image/png' });
    }
  }
  
  throw new Error("No image generated in the response");
}

async function saveWaveFile(
   filename: string,
   pcmData: Buffer,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

export async function generateAudio(prompt: string, voiceName: string = 'Charon'): Promise<string> {
   console.log('[generateAudio] Starting audio generation...');
   console.log('[generateAudio] Prompt length:', prompt.length);
   console.log('[generateAudio] Voice:', voiceName);
   
   const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

   try {
      console.log('[generateAudio] Calling Gemini TTS API with single voice...');
      const response = await ai.models.generateContent({
         model: "gemini-2.5-flash-preview-tts",
         // @ts-ignore
         contents: [{ parts: [{ text: prompt }] }],
         config: {
               responseModalities: ['AUDIO'],
               speechConfig: {
                  voiceConfig: {
                     prebuiltVoiceConfig: { voiceName: voiceName }
                  }
               }
         }
      });

      const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (!data) {
         console.error('[generateAudio] No audio data in response:', JSON.stringify(response, null, 2));
         throw new Error('No audio data received from API');
      }
      
      console.log('[generateAudio] Audio data received, size:', Buffer.from(data, 'base64').length, 'bytes');
      const audioBuffer = Buffer.from(data, 'base64');

      // Convert buffer to WAV format
      const id = crypto.randomUUID();
      const fileName = `aurora-${id}`;
      
      console.log('[generateAudio] Converting to WAV and uploading to Cloudinary...');
      
      // Create a temporary WAV file buffer
      const wavBuffer = await createWavBuffer(audioBuffer);
      
      // Upload to Cloudinary
      const uploadResult = await uploadAudioFromBuffer(
         wavBuffer,
         fileName,
         'ophiuchus-quest/audio'
      );
      
      console.log('[generateAudio] Audio uploaded successfully to Cloudinary:', uploadResult.secureUrl);
      
      // Return the Cloudinary URL
      return uploadResult.secureUrl;
   } catch (error) {
      console.error('[generateAudio] Error generating audio:', error);
      if (error instanceof Error) {
         console.error('[generateAudio] Error message:', error.message);
         console.error('[generateAudio] Error stack:', error.stack);
      }
      throw error;
   }
}

async function createWavBuffer(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<Buffer> {
   return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const writer = new wav.Writer({
         channels,
         sampleRate: rate,
         bitDepth: sampleWidth * 8,
      });

      writer.on('data', (chunk: Buffer) => chunks.push(chunk));
      writer.on('finish', () => resolve(Buffer.concat(chunks)));
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

// console.log(await generate("Hello, how are you?"))