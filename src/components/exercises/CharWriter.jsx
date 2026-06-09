import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'

// Stroke-order writing quiz for a single character, powered by Hanzi Writer.
// Modes: 'quiz' (user draws), 'animate' (watch the demo).
export default function CharWriter({ char, onComplete, size = 280 }) {
  const ref = useRef(null)
  const writerRef = useRef(null)
  const [mistakes, setMistakes] = useState(0)
  const [done, setDone] = useState(false)
  const [showOutline, setShowOutline] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    setMistakes(0); setDone(false)
    if (!ref.current) return
    ref.current.innerHTML = ''
    let writer
    try {
      writer = HanziWriter.create(ref.current, char, {
        width: size,
        height: size,
        padding: 8,
        showOutline,
        showCharacter: false,
        strokeColor: '#34d399',
        radicalColor: '#fbbf24',
        outlineColor: '#243352',
        drawingColor: '#7dd3fc',
        drawingWidth: 28,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 120,
        onLoadCharDataError: () => setLoadError(true),
      })
      writerRef.current = writer
      let local = 0
      writer.quiz({
        leniency: 1.0,
        showHintAfterMisses: 2,
        onMistake: () => { local += 1; setMistakes((m) => m + 1) },
        onComplete: () => { setDone(true); onComplete?.(local) },
      })
    } catch {
      setLoadError(true)
    }
    return () => { try { writer?.cancelQuiz?.() } catch {} }
  }, [char, size, showOutline]) // eslint-disable-line react-hooks/exhaustive-deps

  const animate = () => writerRef.current?.animateCharacter()

  if (loadError) {
    return (
      <div className="grid place-items-center text-center gap-3 py-8">
        <div className="text-8xl han">{char}</div>
        <p className="text-slate-400 text-sm">Stroke data needs a connection. Trace the character above from memory.</p>
        <button onClick={() => onComplete?.(0)} className="px-5 py-2 rounded-xl bg-jade-500 text-ink-900 font-semibold">Done</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ref}
        className="rounded-3xl bg-ink-800 border border-white/10"
        style={{ width: size, height: size, touchAction: 'none' }}
      />
      <div className="flex items-center gap-3 text-sm">
        <span className={mistakes ? 'text-cinnabar-400' : 'text-slate-500'}>
          {mistakes ? `${mistakes} mistake${mistakes > 1 ? 's' : ''}` : 'Draw the strokes in order'}
        </span>
      </div>
      <div className="flex gap-2">
        <button onClick={animate} className="px-4 py-2 rounded-xl bg-ink-700 border border-white/10 text-sky-300 text-sm">
          ▶ Show me
        </button>
        <button onClick={() => setShowOutline((v) => !v)} className="px-4 py-2 rounded-xl bg-ink-700 border border-white/10 text-slate-300 text-sm">
          {showOutline ? 'Hide outline' : 'Show outline'}
        </button>
      </div>
    </div>
  )
}
