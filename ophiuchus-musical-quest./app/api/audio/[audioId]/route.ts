import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { audioId: string } }
) {
  try {
    console.log('[GET /api/audio/[audioId]] Serving audio:', params.audioId);

    const filePath = path.join(process.cwd(), 'temp', `output-${params.audioId}.wav`);
    const fileBuffer = await readFile(filePath);

    console.log('[GET /api/audio/[audioId]] Audio file loaded, size:', fileBuffer.length);

    return new NextResponse(fileBuffer.buffer as any, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('[GET /api/audio/[audioId]] Error:', error);
    return NextResponse.json(
      { error: 'Audio file not found' },
      { status: 404 }
    );
  }
}
