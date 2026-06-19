import { useState } from 'react'
import { annotate } from '../../lib/pinyin'
import { SpeakerButton, Choice, PrimaryButton, SentenceLine } from '../ui/common'
import { useSettings } from '../../hooks/useSettings'

// Grammar drill: the pattern keyword is blanked out of a sentence; pick the right word.
// After answering, a detailed feedback panel explains the rule and why each choice
// fits or not; the user reads it and taps Continue.
export default function FillBlank({ exercise, speak, speaking, onResult, onReviewLesson }) {
  const { sentence, keyword, options, grammar } = exercise
  const { showPinyin } = useSettings()
  const [picked, setPicked] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const idx = sentence.hanzi.indexOf(keyword)
  const before = idx >= 0 ? sentence.hanzi.slice(0, idx) : sentence.hanzi
  const after = idx >= 0 ? sentence.hanzi.slice(idx + keyword.length) : ''

  const choose = (i) => {
    if (revealed) return
    speak?.(options[i].label, { rate: 1.0 })
    setPicked(i); setRevealed(true)
    setTimeout(() => speak?.(sentence.hanzi), 400)
  }

  const wasCorrect = revealed && options[picked]?.correct
  const chosenLabel = picked != null ? options[picked].label : null
  const filled = revealed ? (wasCorrect ? keyword : '___') : '___'

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 justify-center">
        <SpeakerButton onClick={() => speak?.(sentence.hanzi)} speaking={speaking} />
        <p className="text-ink-300">{sentence.en}</p>
      </div>

      <div className="rounded-xl border border-ink-700 p-5">
        <div className="flex flex-wrap items-end justify-center gap-x-0.5 gap-y-1 text-2xl">
          {annotate(before).map((s, i) => (
            <span key={'b' + i} className="flex flex-col items-center leading-tight">
              {showPinyin && <span className={`text-[10px] tone${s.tone}`}>{s.pinyin}</span>}
              <span className="han">{s.hanzi}</span>
            </span>
          ))}
          <span className={`han mx-1 px-3 pb-0.5 border-b-2 ${revealed ? (wasCorrect ? 'border-accent text-accent' : 'border-cinnabar-500 text-cinnabar-300') : 'border-ink-500 text-ink-400'}`}>
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
              <SentenceLine text={o.label} size="text-2xl" pinyinSize="text-xs" />
            </Choice>
          )
        })}
      </div>

      {/* Detailed feedback */}
      {revealed && (
        <div className="rounded-xl border border-ink-700 p-4 animate-slideup flex flex-col gap-3">
          <p className={`font-semibold ${wasCorrect ? 'text-accent' : 'text-cinnabar-300'}`}>
            {wasCorrect ? '正确 · Correct!' : '再想想 · Not quite'}
          </p>

          {/* the completed sentence */}
          <div>
            <SentenceLine text={sentence.hanzi} size="text-xl" />
            <p className="text-ink-400 text-sm mt-1">{sentence.en}</p>
          </div>

          {/* the rule + why this answer fits */}
          {grammar && (
            <div className="text-sm text-ink-200 leading-relaxed border-t border-ink-700 pt-3">
              <p>{grammar.summary}</p>
              {grammar.why && (
                <p className="mt-1.5">
                  <span className="han text-accent">{keyword}</span> — {grammar.why}
                </p>
              )}
              {!wasCorrect && chosenLabel && grammar.contrasts?.[chosenLabel] && (
                <p className="mt-1.5 text-cinnabar-200/90">
                  You chose <span className="han">{chosenLabel}</span> — {grammar.contrasts[chosenLabel]}
                </p>
              )}
            </div>
          )}

          {onReviewLesson && (
            <button onClick={onReviewLesson} className="self-start text-xs font-medium text-accent hover:underline">
              Review full lesson →
            </button>
          )}

          <PrimaryButton color={wasCorrect ? 'jade' : 'cinnabar'} onClick={() => onResult?.(wasCorrect)}>
            Continue
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}
