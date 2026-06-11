import { CHAPTERS, CURRENT_CHAPTER } from '../data/chapters'
import { deriveMastery, defaultCard } from '../lib/sm2'

export default function ChapterPath({ progress, onOpen, onOpenGrammar }) {
  return (
    <div className="px-5 pb-6">
      <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-3 mt-2">HSK Standard Course · 15 chapters</h2>
      <div className="relative">
        {CHAPTERS.map((c, i) => {
          const learned = c.coreWords.filter((w) => {
            const m = deriveMastery(progress.cardFor(w.id) || defaultCard())
            return m === 'mastered' || m === 'familiar'
          }).length
          const pct = c.coreWords.length ? Math.round((learned / c.coreWords.length) * 100) : 0
          const isCurrent = c.num === CURRENT_CHAPTER
          const side = i % 2 === 0 ? 'self-start' : 'self-end'
          const done = c.status === 'done'
          return (
            <div key={c.num} className="flex flex-col">
              {isCurrent && (
                <div className={`${side} w-[82%] mb-1`}>
                  <span className="inline-block text-[10px] font-semibold text-gold-400 bg-gold-500/15 border border-gold-500/30 rounded-full px-2 py-0.5">
                    📍 Your class is here
                  </span>
                </div>
              )}
              <div className={`${side} w-[82%] rounded-2xl border mb-3 overflow-hidden
                ${isCurrent ? 'bg-gold-500/10 border-gold-500/40'
                  : pct >= 100 ? 'bg-jade-600/15 border-jade-500/40'
                  : 'bg-ink-800 border-white/10'}`}>
                <button onClick={() => onOpen(c.num)} className="w-full text-left p-3.5 active:bg-white/5 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl grid place-items-center font-bold shrink-0
                      ${pct >= 100 ? 'bg-jade-500/25 text-jade-300' : isCurrent ? 'bg-gold-500/25 text-gold-300' : 'bg-ink-700 text-slate-300'}`}>
                      {pct >= 100 ? '✓' : c.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-semibold han truncate">{c.titleZh}</h3>
                        {!done && !isCurrent && <span className="text-[10px] text-slate-500">soon</span>}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{c.theme}</p>
                      <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden mt-2">
                        <div className="h-full bg-jade-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 shrink-0">{c.coreWords.length} words</div>
                  </div>
                </button>

                {/* Grammar points as part of the path — tap to learn the pattern */}
                {c.grammar.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-3.5 pb-3 -mt-1">
                    {c.grammar.map((g) => {
                      const gp = progress.grammarFor(g.id)
                      const practiced = gp && gp.correct > 0
                      return (
                        <button
                          key={g.id}
                          onClick={() => onOpenGrammar(g)}
                          title={g.title}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border transition active:scale-95
                            ${practiced ? 'bg-jade-500/15 border-jade-500/40 text-jade-300'
                              : gp ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                              : 'bg-ink-700 border-white/10 text-slate-300'}`}
                        >
                          <span className="han text-sm">{g.drill.keyword}</span>
                          {practiced && <span className="text-[9px]">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
