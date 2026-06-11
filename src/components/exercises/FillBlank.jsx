import { useState } from 'react'
import { annotate } from '../../lib/pinyin'
import { SpeakerButton, Choice, PrimaryButton } from '../ui/common'
import { useSettings } from '../../hooks/useSettings'

// Grammar drill: the pattern keyword is blanked out of a sentence; pick the right word.
export default function FillBlank({ exercise, speak, speaking, onResult }) {
  const { sentence, keyword, options } = exercise
  const { showPinyin } = useSettings()
  const [picked, setPicked] = useState(null)
  const [revealed, setRevealed] = useState(false)

  // Split the sentence at the (first) keyword occurrence for the blank display.
  const idx = sentence.hanzi.indexOf(keyword)
  const before = idx >= 0 ? sentence.hanzi.slice(0, idx) : sentence.hanzi
  const after = idx >= 0 ? sentence.hanzi.slice(idx + keyword.length) : ''

  const choose = (i) => {
    if (revealed) return
    speak?.(options[i].label, { rate: 0.7 }) // tapping a character plays it
    setPicked(i); setRevealed(true)
    const ok = options[i].correct
    setTimeout(() => speak?.(sentence.hanzi), 450)
    setTimeout(() => onResult?.(ok), ok ? 850 : 1700)
  }

  const wasCorrect = revealed && options[picked]?.correct
  const filled = revealed ? (wasCorrect ? keyword : '___') : '___'

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 justify-center">
        <SpeakerButton onClick={() => speak?.(sentence.hanzi)} speaking={speaking} />
        <p className="text-slate-300">{sentence.en}</p>
      </div>

      <div className="rounded-2xl bg-ink-800 border border-white/10 p-5">
        <div className="flex flex-wrap items-end justify-center gap-x-0.5 gap-y-1 text-2xl">
          {annotate(before).map((s, i) => (
            <span key={'b' + i} className="flex flex-col items-center leading-tight">
              {showPinyin && <span className={`text-[10px] tone${s.tone}`}>{s.pinyin}</span>}
              <span className="han">{s.hanzi}</span>
            </span>
          ))}
          <span className={`han mx-1 px-3 pb-0.5 border-b-2 ${revealed ? (wasCorrect ? 'border-jade-400 text-jade-300' : 'border-cinnabar-400 text-cinnabar-300') : 'border-gold-400 text-gold-400'}`}>
            {filled}
          </span>
          {annotate(after).map((s, i) => (
            <span key={'a' + i} className="flex flex-col items-center leading-tight">
              {showPinyin && <span className={`text-[10px] tone${s.tone}`}>{s.pinyin}</span>}
              <span className="han">{s.hanzi}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((o, i) => {
          let state = 'idle'
          if (revealed) state = o.correct ? 'correct' : i === picked ? 'wrong' : 'muted'
          return (
            <Choice key={i} state={state} disabled={revealed} onClick={() => choose(i)}>
              <span className="han text-2xl">{o.label}</span>
            </Choice>
          )
        })}
      </div>

      {revealed && !wasCorrect && (
        <p className="text-center text-cinnabar-300">Answer: <span className="han text-xl">{keyword}</span></p>
      )}
    </div>
  )
}
