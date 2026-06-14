import { CHAPTER_BY_NUM, CURRENT_CHAPTER } from '../../data/chapters'
import { GRAMMAR } from '../../data/grammar'
import { PinyinToggle } from '../ui/common'
import DuoButton from './DuoButton'

export default function RightRail({ progress, stats, onPractice, className = '' }) {
  const cur = CHAPTER_BY_NUM[CURRENT_CHAPTER]
  const today = new Date().toISOString().slice(0, 10)
  const xpToday = progress.state.daily?.[today] || 0
  const goal = 30
  const grammarDone = Object.keys(progress.state.grammar || {}).length
  const masteredPct = Math.round((stats.mastered / stats.total) * 100)

  return (
    <aside className={`w-[300px] shrink-0 px-6 py-7 ${className}`}>
      {/* Stats */}
      <div className="flex items-center justify-between text-sm mb-7">
        <span className="text-ink-300">🔥 {progress.state.streak}</span>
        <span className="text-ink-300">{progress.state.xp} XP</span>
        <PinyinToggle />
      </div>

      {/* Continue */}
      <div className="mb-7">
        <p className="text-[11px] uppercase tracking-wider text-ink-400 mb-1.5">Your class · Ch {cur.num}</p>
        <p className="han text-lg text-white leading-tight">{cur.titleZh}</p>
        <p className="text-sm text-ink-400 mb-3">{cur.en}</p>
        <DuoButton color="accent" className="w-full" onClick={() => onPractice(cur)}>Continue</DuoButton>
      </div>

      {/* Progress lines */}
      <div className="space-y-4">
        <Meter label="Words mastered" value={`${stats.mastered}/${stats.total}`} pct={masteredPct} />
        <Meter label="Grammar seen" value={`${grammarDone}/${GRAMMAR.length}`} pct={Math.round((grammarDone / GRAMMAR.length) * 100)} />
        <Meter label="Today's goal" value={`${Math.min(xpToday, goal)}/${goal} XP`} pct={Math.min(100, (xpToday / goal) * 100)} />
      </div>
    </aside>
  )
}

function Meter({ label, value, pct }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-ink-300">{label}</span>
        <span className="text-ink-400 tabular-nums">{value}</span>
      </div>
      <div className="h-1 rounded-full bg-ink-700 overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
