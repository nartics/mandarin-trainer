import { useMemo, useState } from 'react'
import { annotate } from '../../lib/pinyin'
import { shuffle } from '../../lib/queue'
import { SpeakerButton } from '../ui/common'

// Reconstruct a Chinese sentence by tapping characters in the right order.
// Accepts a `sentence` {hanzi,en}, falling back to a word's example sentence.
export default function BuildSentence({ sentence, word, onResult, speak, speaking }) {
  const src = sentence || (word?.ex ? { hanzi: word.ex[0], en: word.ex[1] } : { hanzi: word?.hanzi || '', en: word?.en || '' })
  const target = src.hanzi
  const english = src.en
  const chars = useMemo(() => Array.from(target).filter((c) => c !== ' '), [target])
  const tokens = useMemo(
    () => shuffle(chars.map((c, i) => ({ c, i }))),
    [target] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const [picked, setPicked] = useState([])
  const [checked, setChecked] = useState(false)

  const used = new Set(picked.map((p) => p.i))
  const built = picked.map((p) => p.c).join('')
  const correct = built === chars.join('')

  const pick = (t) => { if (!checked && !used.has(t.i)) setPicked([...picked, t]) }
  const unpick = (idx) => { if (!checked) setPicked(picked.filter((_, i) => i !== idx)) }

  const check = () => {
    setChecked(true)
    setTimeout(() => onResult?.(correct), correct ? 700 : 1600)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 justify-center">
        <SpeakerButton onClick={() => speak?.(target)} speaking={speaking} />
        <p className="text-slate-300 text-lg flex-1">{english}</p>
      </div>

      {/* Answer slots */}
      <div className="min-h-[64px] rounded-2xl border border-dashed border-white/15 bg-ink-800 p-3 flex flex-wrap gap-2 items-center justify-center">
        {picked.length === 0 && <span className="text-slate-500 text-sm">Tap the characters in order…</span>}
        {picked.map((p, idx) => (
          <button key={idx} onClick={() => unpick(idx)} className="han text-2xl px-3 py-1.5 rounded-xl bg-ink-600 border border-white/10">
            {p.c}
          </button>
        ))}
      </div>

      {checked && (
        <div className={`text-center ${correct ? 'text-jade-400' : 'text-cinnabar-400'}`}>
          {correct ? '✓ 正确 — correct!' : (
            <div className="flex flex-col items-center gap-1">
              <span>Correct answer:</span>
              <div className="flex flex-wrap justify-center gap-x-1">
                {annotate(target).map((s, i) => (
                  <span key={i} className="flex flex-col items-center leading-tight">
                    <span className={`text-xs tone${s.tone}`}>{s.pinyin}</span>
                    <span className="han text-2xl text-slate-100">{s.hanzi}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Token bank */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tokens.map((t) => (
          <button
            key={t.i}
            onClick={() => pick(t)}
            disabled={used.has(t.i) || checked}
            className={`han text-2xl px-3 py-2 rounded-xl border transition ${
              used.has(t.i) ? 'opacity-25 border-white/5 bg-ink-800' : 'bg-ink-700 border-white/10 active:scale-95'
            }`}
          >
            {t.c}
          </button>
        ))}
      </div>

      {!checked && (
        <button
          onClick={check}
          disabled={picked.length !== chars.length}
          className="w-full py-4 rounded-2xl font-semibold text-lg bg-jade-500 text-ink-900 disabled:opacity-40"
        >
          Check
        </button>
      )}
    </div>
  )
}
