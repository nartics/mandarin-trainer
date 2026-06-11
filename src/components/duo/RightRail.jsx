import { CHAPTER_BY_NUM, CURRENT_CHAPTER } from '../../data/chapters'
import { GRAMMAR } from '../../data/grammar'
import { PinyinToggle } from '../ui/common'
import DuoButton from './DuoButton'

function Gem() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="#1cb0f6" d="M6 2h12l4 6-10 14L2 8z" /><path fill="#7fd4fb" d="M6 2h12l-6 6z" /></svg>
  )
}

export default function RightRail({ progress, stats, onPractice, className = '' }) {
  const cur = CHAPTER_BY_NUM[CURRENT_CHAPTER]
  const today = new Date().toISOString().slice(0, 10)
  const xpToday = progress.state.daily?.[today] || 0
  const goal = 30
  const grammarDone = Object.keys(progress.state.grammar || {}).length

  return (
    <aside className={`w-[360px] shrink-0 px-5 py-6 ${className}`}>
      {/* Stats row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 font-extrabold">
          <span className="w-7 h-7 rounded-md bg-duo-red grid place-items-center han text-white text-sm">汉</span>
          <span>HSK 1</span>
        </div>
        <div className="flex items-center gap-1.5 font-extrabold text-duo-gold">
          <span className="text-lg">🔥</span>{progress.state.streak}
        </div>
        <div className="flex items-center gap-1.5 font-extrabold text-duo-blue">
          <Gem />{progress.state.xp}
        </div>
        <PinyinToggle />
      </div>

      {/* Your class card */}
      <div className="rounded-2xl border-2 border-duo-border p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-extrabold">Your class</h3>
          <span className="text-[11px] font-bold text-duo-gold uppercase">Chapter {cur.num}</span>
        </div>
        <p className="han text-lg font-extrabold leading-tight">{cur.titleZh}</p>
        <p className="text-sm text-duo-muted mb-3">{cur.en}</p>
        <DuoButton color="green" className="w-full" onClick={() => onPractice(cur)}>Continue</DuoButton>
      </div>

      {/* Daily goal */}
      <div className="rounded-2xl border-2 border-duo-border p-4 mb-4">
        <h3 className="font-extrabold mb-3">Daily goal</h3>
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div className="flex-1">
            <div className="h-4 rounded-full bg-duo-card2 overflow-hidden">
              <div className="h-full bg-duo-gold rounded-full transition-all" style={{ width: `${Math.min(100, (xpToday / goal) * 100)}%` }} />
            </div>
          </div>
          <span className="text-sm font-bold text-duo-muted tabular-nums">{Math.min(xpToday, goal)}/{goal}</span>
        </div>
      </div>

      {/* Progress card */}
      <div className="rounded-2xl border-2 border-duo-border p-4">
        <h3 className="font-extrabold mb-3">Progress</h3>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-duo-card2 py-3">
            <div className="text-xl font-extrabold text-duo-green">{stats.mastered}</div>
            <div className="text-[11px] text-duo-muted">words mastered</div>
          </div>
          <div className="rounded-xl bg-duo-card2 py-3">
            <div className="text-xl font-extrabold text-duo-purple">{grammarDone}/{GRAMMAR.length}</div>
            <div className="text-[11px] text-duo-muted">grammar seen</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-6 text-[11px] font-bold text-duo-muted uppercase tracking-wide">
        <span>HSK Standard Course</span><span>·</span><span>Manhattan Mandarin</span>
      </div>
    </aside>
  )
}
