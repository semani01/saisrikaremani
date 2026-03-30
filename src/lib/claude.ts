/**
 * claude.ts — Anthropic Claude API client
 * Filled in during Phase 6 (Race Engineer chatbot).
 *
 * The API key is NEVER used client-side. All Claude calls go through
 * the /api/chat server route which reads ANTHROPIC_API_KEY from env.
 */

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatContext {
  currentSector?: 1 | 2 | 3
  nearbyPOI?: string | null
  selectedCar?: string | null
}

/**
 * Sends a message to the race engineer via the /api/chat proxy route.
 * Returns an async generator for streaming responses.
 * Phase 6: implement streaming with ReadableStream.
 */
export async function sendToEngineer(
  messages: ChatMessage[],
  context: ChatContext
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  })

  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`)
  }

  const data = await res.json()
  return data.message as string
}

/**
 * Builds the race engineer system prompt with Sai's full career context.
 * Phase 6: move this to the server route (/api/chat/route.ts) where it
 * can safely import portfolio.ts without exposing it to the client bundle.
 */
export function buildSystemPrompt(): string {
  // TODO (Phase 6): Construct full system prompt from portfolio.ts data
  // mapping all skills/experience to F1 terminology via f1Mappings.ts
  return `You are the race engineer for Sai Emani. Placeholder — implement in Phase 6.`
}
