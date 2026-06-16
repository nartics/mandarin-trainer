import { useSettings } from '../hooks/useSettings'
import { BADGES, BADGE_GROUPS, buildCtx, isEarned, progressFor } from '../data/badges'
import Ring from './ui/Ring'

const today = () => new Date().toISOString().slice(0, 10)

export default function ProfilePanel({ progress, onClose }) {
  const { dailyGoal, setDailyGoal } = useSettings()
  const ctx = buildCtx(progress, dailyGoal)
  const { state, stats } = progress
  const xpToday = state.daily?.[today()] || 0
  const streak = Math.max(state.streak || 0, 0)

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-5 py-8 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-ink-700 bg-ink-900 p-6 my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Your progress</h2>
          <button onClick={onClose} className="text-ink-400 text-xl px-1">✕</button>
        </div>

        {/* Daily goal + streak */}
        <div className="flex items-center gap-5 mb-5">
          <Ring value={xpToday} max={dailyGoal} size={72} stroke={6}>
            <div className="text-center leading-none">
              <div className="text-base font-bold text-white">{Math.min(xpToday, dailyGoal)}</div>
              <div className="text-[9px] text-ink-400">/{dailyGoal} XP</div>
            </div>
          </Ring>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white">🔥 {streak}<span className="text-sm font-normal text-ink-400"> day{streak === 1 ? '' : 's'}</span></p>
            <p className="text-xs text-ink-400 mt-0.5">Best streak: {Math.max(state.bestStreak || 0, streak)} · {state.xp} XP total</p>
          </div>
        </div>

        {/* Daily goal selector */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-ink-400 mr-1">Daily goal</span>
          {[15, 30, 60].map((g) => (
            <button key={g} onClick={() => setDailyGoal(g)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${dailyGoal === g ? 'bg-accent-soft border-accent/40 text-accent' : 'border-ink-600 text-ink-400 hover:text-white'}`}>
              {g} XP
            </button>
          ))}
        </div>

        {/* Totals */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
          <Stat value={stats.mastered} label="mastered" />
          <Stat value={Object.keys(state.grammar || {}).length} label="grammar" />
          <Stat value={ctx.charsClean} label="characters" />
        </div>

        {/* Achievements */}
        <h3 className="text-xs uppercase tracking-wider text-ink-400 mb-3">Achievements</h3>
        {BADGE_GROUPS.map((group) => {
          const badges = BADGES.filter((b) => b.group === group)
          return (
            <div key={group} className="mb-4">
              <p className="text-[11px] text-ink-500 mb-2">{group}</p>
              <div className="grid grid-cols-2 gap-2">
                {badges.map((b) => {
                  const earned = isEarned(b, ctx)
                  const p = progressFor(b, ctx)
                  return (
                    <div key={b.id} title={b.desc}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 ${earned ? 'border-accent/40 bg-accent-soft' : 'border-ink-700 opacity-60'}`}>
                      <span className={`text-xl leading-none ${earned ? '' : 'grayscale'}`}>{b.icon}</span>
                      <span className="min-w-0">
                        <span className={`block text-xs font-semibold truncate ${earned ? 'text-white' : 'text-ink-300'}`}>{b.name}</span>
                        <span className="block text-[10px] text-ink-500 truncate">{earned ? b.desc : `${p.current}/${p.threshold}`}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-ink-700 py-3">
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-[11px] text-ink-400 mt-0.5">{label}</div>
    </div>
  )
}
