import { useState, useMemo } from 'react'
import { CHAR_LIST } from '../data/chapters'
import { useSpeech } from '../hooks/useSpeech'
import { useSettings } from '../hooks/useSettings'
import CharWriter from './exercises/CharWriter'
import { SpeakerButton, PrimaryButton } from './ui/common'

export default function WriteTrainer({ progress, onWrite }) {
  const { speak, speaking } = useSpeech()
  const { showPinyin } = useSettings()
  const [active, setActive] = useState(null) // index into CHAR_LIST
  const chars = CHAR_LIST

  const open = (i) => setActive(i)
  const close = () => setActive(null)
  const next = () => setActive((i) => (i + 1) % chars.length)

  const writtenCount = useMemo(() => Object.keys(progress.state.write).length, [progress.state.write])

  if (active != null) {
    const c = chars[active]
    return (
      <div className="fixed inset-0 z-40 bg-ink-900 flex flex-col safe-top">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button onClick={close} className="text-slate-400 text-2xl px-2">✕</button>
          <span className="text-sm text-slate-400">{active + 1} / {chars.length}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-5 pb-6">
          <div className="text-center">
            {showPinyin && <p className="tone1 text-xl">{c.pinyin}</p>}
            <p className="text-slate-400 text-sm">{c.en} · from 「{c.fromWord}」</p>
          </div>
          <CharWriter key={active} char={c.char} onComplete={(m) => onWrite?.(c.char, m)} />
          <div className="flex items-center gap-3">
            <SpeakerButton onClick={() => speak(c.char, { rate: 0.7 })} speaking={speaking} />
            <div className="w-44"><PrimaryButton onClick={next}>Next character →</PrimaryButton></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 pb-6">
      <div className="flex items-end justify-between mb-1 mt-2">
        <h2 className="text-xl font-bold">Writing 写字</h2>
        <span className="text-sm text-slate-400">{writtenCount}/{chars.length} practiced</span>
      </div>
      <p className="text-slate-400 text-sm mb-4">Tap a character to practice stroke order. Trace it correctly to master it.</p>
      <div className="grid grid-cols-4 gap-2.5">
        {chars.map((c, i) => {
          const w = progress.state.write[c.char]
          const mastered = w && (w.bestMistakes ?? 99) === 0
          return (
            <button
              key={c.char}
              onClick={() => open(i)}
              className={`aspect-square rounded-2xl border grid place-items-center relative active:scale-95 transition
                ${mastered ? 'bg-jade-600/20 border-jade-500/40' : w ? 'bg-ink-700 border-white/15' : 'bg-ink-800 border-white/10'}`}
            >
              <span className="han text-3xl">{c.char}</span>
              {mastered && <span className="absolute top-1 right-1.5 text-jade-400 text-xs">✓</span>}
              {w && !mastered && <span className="absolute top-1 right-1.5 text-gold-400 text-[10px]">●</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
