import { useSpeech } from '../hooks/useSpeech'
import { PrimaryButton, PinyinToggle, SentenceLine } from './ui/common'

// A single grammar lesson: pattern + explanation + examples + common mix-ups + practice.
export default function GrammarLesson({ grammar, onClose, onPractice }) {
  const { speak, speaking } = useSpeech()
  const mixups = grammar.contrasts ? Object.entries(grammar.contrasts) : []
  return (
    <div className="fixed inset-0 z-50 bg-ink-900 flex flex-col safe-top">
      <div className="flex items-center gap-3 px-4 pt-3 pb-3 border-b border-ink-700">
        <button onClick={onClose} className="text-ink-300 text-2xl px-2">←</button>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold truncate">{grammar.title}</h2>
          <p className="text-xs text-accent han">{grammar.patternZh}</p>
        </div>
        <PinyinToggle />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5 pb-28">
        <div className="max-w-md mx-auto">
          <div className="rounded-xl border border-accent/30 bg-accent-soft p-4 mb-5">
            <p className="text-ink-100 leading-relaxed">{grammar.summary}</p>
            {grammar.why && <p className="text-ink-200 text-sm mt-2"><span className="han text-accent">{grammar.drill?.keyword}</span> — {grammar.why}</p>}
          </div>

          {grammar.notes?.length > 0 && (
            <ul className="space-y-2 mb-6">
              {grammar.notes.map((n, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-200">
                  <span className="text-accent mt-0.5">▸</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}

          <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">Examples from class</h3>
          <div className="space-y-2 mb-7">
            {grammar.examples.map((ex, i) => (
              <button key={i} onClick={() => speak(ex.hanzi)}
                className="w-full text-left rounded-xl border border-ink-700 p-3 flex items-center gap-3 active:bg-white/5">
                <span className="text-accent text-lg shrink-0">🔊</span>
                <span className="flex-1 min-w-0">
                  <SentenceLine text={ex.hanzi} size="text-xl" />
                  <span className="block text-ink-400 text-sm mt-1">{ex.en}</span>
                </span>
              </button>
            ))}
          </div>

          {mixups.length > 0 && (
            <>
              <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">Common mix-ups</h3>
              <ul className="space-y-2">
                {mixups.map(([word, reason]) => (
                  <li key={word} className="flex gap-3 text-sm rounded-xl border border-ink-700 p-3">
                    <span className="han text-xl text-ink-200 shrink-0 w-8 text-center">{word}</span>
                    <span className="text-ink-300">{reason}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 safe-bottom bg-ink-900/95 backdrop-blur border-t border-ink-700">
        <div className="max-w-md mx-auto px-5 py-4">
          <PrimaryButton color="jade" onClick={() => onPractice(grammar)}>Practice this pattern</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
