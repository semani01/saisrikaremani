/**
 * /api/chat — Race Engineer chatbot proxy
 * Proxies messages to Claude API server-side so the API key is never
 * exposed to the client bundle.
 *
 * Phase 6: implement full streaming response with race engineer system prompt.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Phase 6: implement full Claude API integration
  // For now, return a stub so the route exists and the build succeeds.

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 501 }
    )
  }

  try {
    const { messages, context } = await req.json()
    void messages
    void context

    // TODO (Phase 6): Build system prompt from portfolio.ts + f1Mappings.ts,
    // call Anthropic SDK, stream response back.
    return NextResponse.json({
      message: 'Race engineer online. Phase 6 will wire up Claude API here.',
    })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
