import { PrimaryButton, SentenceLine } from '../ui/common'

// A quick teaching moment shown inline in a session, right before a grammar drill,
// so the pattern is introduced in context as the user works through exercises.
export default function GrammarTip({ grammar, sentence, speak, speaking, onContinue }) {
  const ex = sentence || grammar.examples[0]
  return (
    <div className="flex flex-col gap-5 animate-slideup">
      <div className="rounded-2xl bg-gold-500/10 border border-gold-500/30 p-5">
        <p className="text-[11px] uppercase tracking-wide text-gold-400 mb-1">💡 Grammar point</p>
        <h3 className="text-xl font-bold mb-1">{grammar.title}</h3>
        <p className="text-sky-300 han text-sm mb-3">{grammar.patternZh}</p>
        <p className="text-slate-200 leading-relaxed">{grammar.summary}</p>
      </div>

      {ex && (
        <button onClick={() => speak?.(ex.hanzi)} className="rounded-2xl bg-ink-800 border border-white/10 p-4 flex items-center gap-3 text-left active:bg-ink-700">
          <span className={`w-12 h-12 shrink-0 rounded-2xl grid place-items-center bg-ink-700 border border-white/10 ${speaking ? 'text-cinnabar-400' : 'text-sky-300'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
            </svg>
          </span>
          <span className="flex-1 min-w-0">
            <SentenceLine text={ex.hanzi} size="text-xl" />
            <span className="block text-slate-400 text-sm mt-1">{ex.en}</span>
          </span>
        </button>
      )}

      <PrimaryButton color="gold" onClick={onContinue}>Got it — try it →</PrimaryButton>
    </div>
  )
}
