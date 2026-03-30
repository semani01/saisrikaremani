/**
 * elevenlabs.ts — ElevenLabs TTS client
 * Filled in during Phase 6 (Race Engineer chatbot voice).
 *
 * Free tier: 10k characters/month.
 * Fallback: browser Web Speech API with en-GB voice.
 */

/**
 * Requests TTS audio for the given text via the /api/tts proxy route.
 * Returns an audio blob URL that can be played via Howler.js.
 * Phase 6: implement with real ElevenLabs API + fallback.
 */
export async function speak(text: string): Promise<string> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!res.ok) throw new Error(`TTS API error: ${res.status}`)

    const blob = await res.blob()
    return URL.createObjectURL(blob)
  } catch {
    // Fallback to browser Web Speech API
    return speakWithBrowser(text)
  }
}

/**
 * Browser Web Speech API fallback.
 * Uses en-GB voice for the F1 radio engineer effect.
 * Returns a dummy URL — caller should use speechSynthesis directly.
 */
function speakWithBrowser(text: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve('')
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-GB'
    utterance.rate = 1.0
    utterance.pitch = 0.9

    // Try to find a British voice
    const voices = window.speechSynthesis.getVoices()
    const britishVoice = voices.find((v) => v.lang === 'en-GB')
    if (britishVoice) utterance.voice = britishVoice

    window.speechSynthesis.speak(utterance)
    resolve('browser-tts') // signal that browser TTS was used
  })
}
