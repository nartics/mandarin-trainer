import { CHAPTER_BY_NUM, CURRENT_CHAPTER } from '../data/chapters'
import { GRAMMAR } from '../data/grammar'
import { PinyinToggle } from './ui/common'

export default function Dashboard({ stats, streak, xp, grammarCount = 0 }) {
  const cur = CHAPTER_BY_NUM[CURRENT_CHAPTER]
  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold leading-none">汉语 <span className="text-ink-400 text-sm font-normal">HSK 1</span></h1>
          <p className="text-ink-400 text-sm mt-1">Manhattan Mandarin · Standard Course</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-ink-300">
          <span>🔥 {streak}</span>
          <span>{xp} XP</span>
          <PinyinToggle />
        </div>
      </div>

      {/* Current chapter */}
      {cur && (
        <div className="rounded-xl border border-ink-700 p-3 mb-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-ink-800 border border-ink-600 grid place-items-center text-ink-200 font-semibold text-sm shrink-0">{cur.num}</div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">Your class is on</p>
            <p className="font-medium han truncate">{cur.titleZh} <span className="text-ink-400 text-xs font-normal">{cur.en}</span></p>
          </div>
        </div>
      )}

      {/* Mastery overview */}
      <div className="rounded-xl border border-ink-700 p-4 mb-2">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm text-ink-300">Words mastered</span>
          <span className="text-sm"><b className="text-accent">{stats.mastered}</b> <span className="text-ink-400">/ {stats.total}</span></span>
        </div>
        <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(stats.mastered / stats.total) * 100}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-ink-400">
          <span>Familiar {stats.familiar}</span>
          <span>Learning {stats.learning}</span>
          <span>Grammar {grammarCount}/{GRAMMAR.length}</span>
        </div>
      </div>
    </div>
  )
}
