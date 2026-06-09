import { useState, useCallback, useRef, useEffect } from 'react'

// Native-voice Mandarin TTS via the browser SpeechSynthesis API.
// On macOS / iOS this uses the system's native Chinese voices (Tingting, Sinji…),
// which sound like a native speaker — no API key, works offline.
let cachedVoices = []
function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  cachedVoices = window.speechSynthesis.getVoices()
  return cachedVoices
}

function pickZhVoice() {
  const voices = cachedVoices.length ? cachedVoices : loadVoices()
  const zh = voices.filter((v) => /zh|cmn/i.test(v.lang))
  // Prefer high-quality named voices, then mainland Mandarin, then any Chinese.
  const preferred = ['Tingting', 'Ting-Ting', 'Sinji', 'Meijia', 'Li-mu', 'Yu-shu', 'Google 普通话']
  for (const name of preferred) {
    const hit = zh.find((v) => v.name.includes(name))
    if (hit) return hit
  }
  return zh.find((v) => /zh[-_]?CN/i.test(v.lang)) || zh[0] || null
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const queued = useRef(null)

  useEffect(() => {
    if (!supported) return
    loadVoices()
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices()
      if (queued.current) { const fn = queued.current; queued.current = null; fn() }
    }
    return () => window.speechSynthesis.cancel()
  }, [supported])

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  const speak = useCallback((text, { rate = 0.85, onEnd } = {}) => {
    if (!supported || !text) return
    const run = () => {
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(text)
      const voice = pickZhVoice()
      if (voice) utt.voice = voice
      utt.lang = 'zh-CN'
      utt.rate = rate
      utt.pitch = 1.0
      utt.onstart = () => setSpeaking(true)
      utt.onend = () => { setSpeaking(false); onEnd?.() }
      utt.onerror = () => { setSpeaking(false); onEnd?.() }
      window.speechSynthesis.speak(utt)
    }
    if (!cachedVoices.length) { queued.current = run; loadVoices() } else run()
  }, [supported])

  return { speak, stop, speaking, supported, hasZhVoice: () => !!pickZhVoice() }
}
