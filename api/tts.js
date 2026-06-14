// Vercel serverless proxy → ElevenLabs text-to-speech.
// Keeps ELEVENLABS_API_KEY server-side. Returns the raw audio/mpeg stream.

export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }
  if (!process.env.ELEVENLABS_API_KEY) {
    return new Response('Server is missing ELEVENLABS_API_KEY', { status: 500 })
  }

  let payload
  try {
    payload = await req.json()
  } catch {
    return new Response('Bad request: expected JSON body', { status: 400 })
  }
  const { text, voiceId, model_id, voice_settings } = payload || {}
  if (!text || !voiceId) {
    return new Response('Bad request: text and voiceId are required', { status: 400 })
  }

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: model_id || 'eleven_multilingual_v2',
        voice_settings: voice_settings || {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  )

  // Stream the audio body straight to the client without re-buffering.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'audio/mpeg',
    },
  })
}
