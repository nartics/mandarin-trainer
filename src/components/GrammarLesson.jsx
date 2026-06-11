import { useSpeech } from '../hooks/useSpeech'
import { PrimaryButton, PinyinToggle, SentenceLine } from './ui/common'

// A single grammar lesson: pattern + explanation + class example sentences + practice.
export default function GrammarLesson({ grammar, onClose, onPractice }) {
  const { speak, speaking } = useSpeech()
  return (
    <div className="fixed inset-0 z-40 bg-ink-900 flex flex-col safe-top">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-b border-white/10">
        <button onClick={onClose} className="text-slate-400 text-2xl px-2">←</button>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold truncate">{grammar.title}</h2>
          <p className="text-xs text-sky-400 han">{grammar.patternZh}</p>
        </div>
        <PinyinToggle />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5 pb-28">
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl bg-sky-500/10 border border-sky-500/25 p-4 mb-5">
            <p className="text-slate-100 leading-relaxed">{grammar.summary}</p>
          </div>

          {grammar.notes?.length > 0 && (
            <ul className="space-y-2 mb-6">
              {grammar.notes.map((n, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-jade-400 mt-0.5">▸</span>
                  <span className="han-inline">{n}</span>
                </li>
              ))}
            </ul>
          )}

          <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-3">Examples from class</h3>
          <div className="space-y-2.5">
            {grammar.examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => speak(ex.hanzi)}
                className="w-full text-left rounded-2xl bg-ink-800 border border-white/10 p-3 flex items-center gap-3 active:bg-ink-700"
              >
                <span className="text-sky-400 text-lg shrink-0">🔊</span>
                <span className="flex-1 min-w-0">
                  <SentenceLine text={ex.hanzi} size="text-xl" />
                  <span className="block text-slate-400 text-sm mt-1">{ex.en}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 safe-bottom bg-ink-900/95 backdrop-blur border-t border-white/10">
        <div className="max-w-md mx-auto px-5 py-4">
          <PrimaryButton color="gold" onClick={() => onPractice(grammar)}>Practice this pattern</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
