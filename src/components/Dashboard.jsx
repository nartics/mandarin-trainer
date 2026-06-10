import { CHAPTER_BY_NUM, CURRENT_CHAPTER } from '../data/chapters'
import { GRAMMAR } from '../data/grammar'

export default function Dashboard({ stats, streak, xp, grammarCount = 0 }) {
  const cur = CHAPTER_BY_NUM[CURRENT_CHAPTER]
  return (
    <div className="px-5 pt-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold leading-none">汉语 <span className="text-slate-500 text-base font-normal">HSK 1</span></h1>
          <p className="text-slate-400 text-sm mt-1">Manhattan Mandarin · Standard Course</p>
        </div>
        <div className="flex gap-2">
          <Badge icon="🔥" value={streak} label="streak" />
          <Badge icon="⭐" value={xp} label="XP" />
        </div>
      </div>

      {/* Current chapter banner */}
      {cur && (
        <div className="rounded-2xl bg-gold-500/10 border border-gold-500/30 p-3 mb-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 grid place-items-center text-gold-300 font-bold shrink-0">{cur.num}</div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-gold-400">Your class is on</p>
            <p className="font-semibold han truncate">{cur.titleZh} <span className="text-slate-400 text-xs font-normal">{cur.en}</span></p>
          </div>
        </div>
      )}

      {/* Mastery overview */}
      <div className="rounded-2xl bg-ink-800 border border-white/10 p-4 mb-2">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm text-slate-400">Words mastered</span>
          <span className="text-sm"><b className="text-jade-400">{stats.mastered}</b> <span className="text-slate-500">/ {stats.total}</span></span>
        </div>
        <div className="h-3 rounded-full bg-ink-700 overflow-hidden flex">
          <div className="h-full bg-jade-500" style={{ width: `${(stats.mastered / stats.total) * 100}%` }} />
          <div className="h-full bg-sky-500/70" style={{ width: `${(stats.familiar / stats.total) * 100}%` }} />
          <div className="h-full bg-gold-500/70" style={{ width: `${(stats.learning / stats.total) * 100}%` }} />
        </div>
        <div className="flex gap-3 mt-3 text-xs text-slate-400 flex-wrap">
          <Legend color="bg-jade-500" label={`Mastered ${stats.mastered}`} />
          <Legend color="bg-sky-500/70" label={`Familiar ${stats.familiar}`} />
          <Legend color="bg-gold-500/70" label={`Learning ${stats.learning}`} />
          <span className="text-sky-400">· Grammar {grammarCount}/{GRAMMAR.length}</span>
        </div>
      </div>
    </div>
  )
}

function Badge({ icon, value, label }) {
  return (
    <div className="rounded-xl bg-ink-800 border border-white/10 px-3 py-1.5 text-center min-w-[56px]">
      <div className="text-base leading-none">{icon} <b>{value}</b></div>
      <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

function Legend({ color, label }) {
  return <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${color}`} />{label}</span>
}
