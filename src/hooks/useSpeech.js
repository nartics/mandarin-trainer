import { useState, useCallback, useRef, useEffect } from 'react'
import { synthesize, hasElevenLabsKey } from '../api/tts'

// Mandarin TTS. Prefers ElevenLabs (when a key is configured) for natural audio,
// and falls back to the browser's system Chinese voice (Tingting, Sinji…) otherwise.
let cachedVoices = []
function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  cachedVoices = window.speechSynthesis.getVoices()
  return cachedVoices
}

function pickZhVoice() {
  const voices = cachedVoices.length ? cachedVoices : loadVoices()
  const zh = voices.filter((v) => /zh|cmn/i.test(v.lang))
  const preferred = ['Tingting', 'Ting-Ting', 'Sinji', 'Meijia', 'Li-mu', 'Yu-shu', 'Google 普通话']
  for (const name of preferred) {
    const hit = zh.find((v) => v.name.includes(name))
    if (hit) return hit
  }
  return zh.find((v) => /zh[-_]?CN/i.test(v.lang)) || zh[0] || null
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const browserTTS = typeof window !== 'undefined' && 'speechSynthesis' in window
  const useEleven = hasElevenLabsKey()
  const audioRef = useRef(null)
  const queued = useRef(null)
  const reqIdRef = useRef(0)

  useEffect(() => {
    if (!browserTTS) return
    loadVoices()
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices()
      if (queued.current) { const fn = queued.current; queued.current = null; fn() }
    }
    return () => window.speechSynthesis.cancel()
  }, [browserTTS])

  const stop = useCallback(() => {
    if (audioRef.current) { try { audioRef.current.pause() } catch {} audioRef.current = null }
    if (browserTTS) window.speechSynthesis.cancel()
    setSpeaking(false); setLoading(false)
  }, [browserTTS])

  useEffect(() => stop, [stop])

  const speakBrowser = useCallback((text, rate, onEnd) => {
    if (!browserTTS) { onEnd?.(); return }
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
  }, [browserTTS])

  const speak = useCallback(async (text, { rate = 0.9, onEnd } = {}) => {
    stop()
    if (!text) return
    const reqId = ++reqIdRef.current
    if (useEleven) {
      setLoading(true)
      let url = null
      try {
        url = await synthesize(text)
      } catch { /* synthesize failed — fall through to browser TTS */ }
      if (reqId !== reqIdRef.current) return
      setLoading(false)
      if (url) {
        const audio = new Audio(url)
        audio.playbackRate = rate
        audio.preservesPitch = true
        audioRef.current = audio
        audio.onplaying = () => setSpeaking(true)
        audio.onended = () => { setSpeaking(false); onEnd?.() }
        audio.onerror = () => { setSpeaking(false); speakBrowser(text, rate, onEnd) }
        try {
          await audio.play()
          return
        } catch {
          // iOS NotAllowedError or interrupted — fall through to browser TTS
          setSpeaking(false)
        }
      }
    }
    if (reqId !== reqIdRef.current) return
    speakBrowser(text, rate, onEnd)
  }, [useEleven, speakBrowser, stop])

  return {
    speak,
    stop,
    speaking,
    loading,
    supported: useEleven || browserTTS,
    hasZhVoice: () => useEleven || !!pickZhVoice(),
  }
}
