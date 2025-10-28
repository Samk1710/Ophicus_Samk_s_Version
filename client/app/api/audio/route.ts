import { NextRequest, NextResponse } from "next/server";

/**
 * API route to proxy audio files from Cloudinary
 * This ensures proper CORS and headers for audio playback
 */
export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const url = searchParams.get("url");

   if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
   }

   try {
      console.log('[Audio API] Fetching audio from:', url);
      
      // Fetch the audio from Cloudinary
      const response = await fetch(url);
      
      if (!response.ok) {
         console.error('[Audio API] Failed to fetch audio:', response.status, response.statusText);
         return NextResponse.json({ error: "Failed to fetch audio file" }, { status: response.status });
      }

      const audioBuffer = await response.arrayBuffer();
      console.log('[Audio API] Audio fetched successfully, size:', audioBuffer.byteLength, 'bytes');

      // Return the audio file with proper headers
      return new NextResponse(audioBuffer, {
         headers: {
            "Content-Type": "audio/wav",
            "Content-Length": audioBuffer.byteLength.toString(),
            "Cache-Control": "public, max-age=3600", // Cache for 1 hour
            "Accept-Ranges": "bytes",
         },
      });
   } catch (error) {
      console.error("[Audio API] Error serving audio file:", error);
      return NextResponse.json({ error: "Failed to serve audio file" }, { status: 500 });
   }
}
