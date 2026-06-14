// ElevenLabs TTS — reads Mandarin aloud in a natural voice.
//
// Activated when an ElevenLabs key is available:
//   • Production / `vercel dev`: the /api/tts edge proxy holds ELEVENLABS_API_KEY
//     server-side (no key in the browser bundle).
//   • Plain `npm run dev`: set VITE_ELEVENLABS_API_KEY to call ElevenLabs directly
//     (dev only — the key is inlined into the bundle).
// Without any key the app falls back to the browser's system Chinese voice.

// A clear, multilingual ElevenLabs voice that handles Mandarin well. Override with
// VITE_ELEVENLABS_VOICE_ID to use your own.
const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah — clear, neutral
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID

const DIRECT_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY
const USE_DIRECT = !!DIRECT_KEY

// In-memory blob-URL cache keyed by `${voiceId}|${text}` so a phrase is only
// synthesised once per session (avoids repeat API calls / cost).
const audioCache = new Map()
const MAX_CACHE = 400

function remember(key, url) {
  if (audioCache.size >= MAX_CACHE) {
    const oldest = audioCache.keys().next().value
    URL.revokeObjectURL(audioCache.get(oldest))
    audioCache.delete(oldest)
  }
  audioCache.set(key, url)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true }

async function synthOneShot(text, voiceId) {
  try {
    let response
    if (USE_DIRECT) {
      response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: { 'xi-api-key': DIRECT_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', language_code: 'zh', voice_settings: VOICE_SETTINGS }),
      })
    } else {
      response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId, model_id: 'eleven_multilingual_v2', language_code: 'zh', voice_settings: VOICE_SETTINGS }),
      })
    }
    if (!response.ok) return { url: null, status: response.status }
    const blob = await response.blob()
    return { url: URL.createObjectURL(blob), status: 200 }
  } catch (err) {
    console.warn('ElevenLabs TTS failed:', err)
    return { url: null, status: -1 }
  }
}

// Synthesise text to a playable audio URL, with cache + 429 backoff. Returns null on failure.
export async function synthesize(text) {
  if (!hasElevenLabsKey() || !text) return null
  const key = `${VOICE_ID}|${text}`
  const cached = audioCache.get(key)
  if (cached) return cached
  for (const wait of [0, 800, 1800]) {
    if (wait) await sleep(wait)
    const { url, status } = await synthOneShot(text, VOICE_ID)
    if (url) { remember(key, url); return url }
    if (status !== 429) return null
  }
  return null
}

// True when there's a path to ElevenLabs: a direct dev key, or (in a browser) the
// /api/tts proxy, which we assume is mounted in production / `vercel dev`.
export function hasElevenLabsKey() {
  if (USE_DIRECT) return true
  return typeof window !== 'undefined' && window.location.protocol.startsWith('http') && !import.meta.env.DEV
}
