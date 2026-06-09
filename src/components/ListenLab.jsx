import { useState, useMemo, useEffect, useRef } from 'react'
import { WORDS } from '../data/vocab'
import { useSpeech } from '../hooks/useSpeech'
import { useSounds } from '../hooks/useSounds'
import { shuffle } from '../lib/queue'
import { annotate } from '../lib/pinyin'
import { SpeakerButton, Choice, PrimaryButton } from './ui/common'

const SENTENCES = WORDS.filter((w) => w.ex).map((w) => ({ id: w.id, zh: w.ex[0], en: w.ex[1], word: w }))

export default function ListenLab({ onReview }) {
  const { speak, speaking, supported, hasZhVoice } = useSpeech()
  const sounds = useSounds()
  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [slow, setSlow] = useState(false)
  const autoplayed = useRef(-1)

  const items = useMemo(() => shuffle(SENTENCES).slice(0, 12), [])
  const cur = items[round]

  const options = useMemo(() => {
    if (!cur) return []
    const others = shuffle(SENTENCES.filter((s) => s.id !== cur.id && s.en !== cur.en)).slice(0, 3)
    return shuffle([{ ...cur, correct: true }, ...others.map((o) => ({ ...o, correct: false }))])
  }, [round]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (cur && autoplayed.current !== round) {
      autoplayed.current = round
      const t = setTimeout(() => speak(cur.zh, { rate: slow ? 0.6 : 0.95 }), 400)
      return () => clearTimeout(t)
    }
  }, [round, cur, speak, slow])

  if (!supported || !hasZhVoice()) {
    return (
      <div className="px-6 py-16 text-center text-slate-400">
        <p className="text-lg mb-2">🔇 No Chinese voice found</p>
        <p className="text-sm">This device has no Mandarin text-to-speech voice installed. On iOS/macOS, add one in Settings → Accessibility → Spoken Content → Voices → Chinese.</p>
      </div>
    )
  }

  const choose = (i) => {
    if (revealed) return
    setPicked(i); setRevealed(true)
    if (options[i].correct) { sounds.correct(); onReview?.(cur.id, 2) }
    else { sounds.wrong(); onReview?.(cur.id, 0) }
  }

  const next = () => {
    setPicked(null); setRevealed(false)
    setRound((r) => (r + 1) % items.length)
  }

  const wasCorrect = revealed && options[picked]?.correct

  return (
    <div className="px-5 pb-32">
      <div className="flex items-end justify-between mb-1 mt-2">
        <h2 className="text-xl font-bold">Listening 听力</h2>
        <span className="text-sm text-slate-400">{round + 1} / {items.length}</span>
      </div>
      <p className="text-slate-400 text-sm mb-6">Listen to the sentence at native speed and choose what it means.</p>

      <div className="flex flex-col items-center gap-4 mb-7">
        <SpeakerButton onClick={() => speak(cur.zh, { rate: slow ? 0.6 : 0.95 })} speaking={speaking} size="w-28 h-28" big />
        <button
          onClick={() => { setSlow((s) => !s); setTimeout(() => speak(cur.zh, { rate: !slow ? 0.6 : 0.95 }), 50) }}
          className={`px-4 py-2 rounded-xl text-sm border ${slow ? 'bg-gold-500/20 border-gold-500/50 text-gold-400' : 'bg-ink-700 border-white/10 text-slate-300'}`}
        >
          🐢 {slow ? 'Slow speed' : 'Native speed'}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((o, i) => {
          let state = 'idle'
          if (revealed) state = o.correct ? 'correct' : i === picked ? 'wrong' : 'muted'
          return <Choice key={i} state={state} disabled={revealed} onClick={() => choose(i)}>{o.en}</Choice>
        })}
      </div>

      {revealed && (
        <div className="mt-6 rounded-2xl bg-ink-800 border border-white/10 p-4">
          <div className="flex flex-wrap justify-center gap-x-1 mb-2">
            {annotate(cur.zh).map((s, i) => (
              <span key={i} className="flex flex-col items-center leading-tight">
                <span className={`text-xs tone${s.tone}`}>{s.pinyin}</span>
                <span className="han text-2xl">{s.hanzi}</span>
              </span>
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm">{cur.en}</p>
          <div className="mt-4"><PrimaryButton color={wasCorrect ? 'jade' : 'cinnabar'} onClick={next}>Next →</PrimaryButton></div>
        </div>
      )}
    </div>
  )
}
