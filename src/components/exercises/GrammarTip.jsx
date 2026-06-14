import { PrimaryButton, SentenceLine } from '../ui/common'

// A quick teaching moment shown inline in a session, right before the drills for a
// newly introduced grammar concept.
export default function GrammarTip({ grammar, sentence, speak, speaking, onContinue }) {
  const ex = sentence || grammar.examples[0]
  return (
    <div className="flex flex-col gap-5 animate-slideup">
      <div className="rounded-xl border border-accent/30 bg-accent-soft p-5">
        <p className="text-[11px] uppercase tracking-wider text-accent mb-1">New grammar point</p>
        <h3 className="text-xl font-semibold mb-1">{grammar.title}</h3>
        <p className="text-ink-300 han text-sm mb-3">{grammar.patternZh}</p>
        <p className="text-ink-100 leading-relaxed">{grammar.summary}</p>
      </div>

      {ex && (
        <button onClick={() => speak?.(ex.hanzi)} className="rounded-xl border border-ink-700 p-4 flex items-center gap-3 text-left active:bg-white/5">
          <span className={`w-11 h-11 shrink-0 rounded-xl grid place-items-center bg-ink-800 border border-ink-600 ${speaking ? 'text-accent' : 'text-ink-200'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
            </svg>
          </span>
          <span className="flex-1 min-w-0">
            <SentenceLine text={ex.hanzi} size="text-xl" />
            <span className="block text-ink-400 text-sm mt-1">{ex.en}</span>
          </span>
        </button>
      )}

      <PrimaryButton color="jade" onClick={onContinue}>Got it — try it →</PrimaryButton>
    </div>
  )
}
