import { PinyinToggle, FlameIcon } from '../ui/common'
import DuoButton from './DuoButton'
import Ring from '../ui/Ring'

export default function RightRail({ chapter, onPractice, stats, streak = 0, xpToday = 0, dailyGoal = 30, onOpenProfile, className = '' }) {
  return (
    <aside className={`w-[300px] shrink-0 px-6 py-7 ${className}`}>
      <div className="flex justify-end mb-6">
        <PinyinToggle />
      </div>

      {/* Engagement: daily goal + streak (tap for full profile) */}
      <button onClick={onOpenProfile} className="w-full flex items-center gap-4 rounded-xl border border-ink-700 p-3 mb-6 text-left hover:bg-white/[0.03] transition">
        <Ring value={xpToday} max={dailyGoal} size={48} stroke={5}>
          <span className="text-[10px] text-ink-300">{Math.min(xpToday, dailyGoal)}</span>
        </Ring>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-sm font-semibold text-white"><FlameIcon className="w-4 h-4 text-amber-400" /> {streak}-day streak</p>
          <p className="text-xs text-ink-400">{stats ? `${stats.mastered} words mastered` : `${Math.min(xpToday, dailyGoal)}/${dailyGoal} XP today`}</p>
        </div>
      </button>

      {chapter && (
        <>
          <p className="text-[11px] uppercase tracking-wider text-ink-400 mb-1.5">Chapter {chapter.num}</p>
          <p className="han text-lg text-white leading-tight">{chapter.titleZh}</p>
          <p className="text-sm text-ink-400 mb-3">{chapter.en}</p>
          <DuoButton color="accent" className="w-full" onClick={() => onPractice(chapter)}>Continue</DuoButton>
        </>
      )}
    </aside>
  )
}
