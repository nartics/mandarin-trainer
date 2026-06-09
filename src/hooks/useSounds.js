import { useRef, useCallback } from 'react'

// Tiny WebAudio feedback chimes — no asset files needed.
export function useSounds() {
  const ctxRef = useRef(null)
  const ctx = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) ctxRef.current = new AC()
    }
    return ctxRef.current
  }

  const tone = useCallback((freq, dur, type = 'sine', when = 0, gain = 0.12) => {
    const ac = ctx()
    if (!ac) return
    const t = ac.currentTime + when
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(gain, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(g); g.connect(ac.destination)
    osc.start(t); osc.stop(t + dur)
  }, [])

  const correct = useCallback(() => { tone(660, 0.12, 'sine', 0); tone(880, 0.16, 'sine', 0.1) }, [tone])
  const wrong = useCallback(() => { tone(200, 0.22, 'sawtooth', 0, 0.08) }, [tone])
  const complete = useCallback(() => {
    tone(523, 0.14, 'sine', 0); tone(659, 0.14, 'sine', 0.12); tone(784, 0.14, 'sine', 0.24); tone(1047, 0.3, 'sine', 0.36)
  }, [tone])

  return { correct, wrong, complete }
}
