/**
 * /api/tts — ElevenLabs TTS proxy
 * Proxies text to ElevenLabs and returns audio/mpeg buffer.
 * API key stays server-side.
 *
 * Phase 6: implement full ElevenLabs integration with voice selection.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ELEVENLABS_API_KEY not configured' },
      { status: 501 }
    )
  }

  try {
    const { text } = await req.json()
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    // TODO (Phase 6): Call ElevenLabs API, return audio/mpeg stream.
    // Voice: search ElevenLabs library for "British radio" / "professional narrator".
    return NextResponse.json({
      message: 'TTS endpoint scaffolded. Phase 6 will wire up ElevenLabs here.',
    })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
