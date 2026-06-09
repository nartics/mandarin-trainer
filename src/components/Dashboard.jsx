export default function Dashboard({ stats, streak, xp }) {
  const masteredPct = Math.round((stats.mastered / stats.total) * 100)
  return (
    <div className="px-5 pt-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold leading-none">汉语 <span className="text-slate-500 text-base font-normal">HSK 1</span></h1>
          <p className="text-slate-400 text-sm mt-1">Master reading · writing · listening</p>
        </div>
        <div className="flex gap-2">
          <Badge icon="🔥" value={streak} label="streak" />
          <Badge icon="⭐" value={xp} label="XP" />
        </div>
      </div>

      {/* Mastery overview */}
      <div className="rounded-2xl bg-ink-800 border border-white/10 p-4 mb-4">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm text-slate-400">Words mastered</span>
          <span className="text-sm"><b className="text-jade-400">{stats.mastered}</b> <span className="text-slate-500">/ {stats.total}</span></span>
        </div>
        <div className="h-3 rounded-full bg-ink-700 overflow-hidden flex">
          <div className="h-full bg-jade-500" style={{ width: `${(stats.mastered / stats.total) * 100}%` }} />
          <div className="h-full bg-sky-500/70" style={{ width: `${(stats.familiar / stats.total) * 100}%` }} />
          <div className="h-full bg-gold-500/70" style={{ width: `${(stats.learning / stats.total) * 100}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-400">
          <Legend color="bg-jade-500" label={`Mastered ${stats.mastered}`} />
          <Legend color="bg-sky-500/70" label={`Familiar ${stats.familiar}`} />
          <Legend color="bg-gold-500/70" label={`Learning ${stats.learning}`} />
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
  return (
    <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${color}`} />{label}</span>
  )
}
