import { useEffect } from 'react'
import { useSounds } from '../hooks/useSounds'
import { PrimaryButton } from './ui/common'
import Mascot from './duo/Mascot'
import Ring from './ui/Ring'
import BadgeToast from './BadgeToast'

export default function LessonComplete({ correct, total, xp, streak = 0, xpToday = 0, dailyGoal = 30, newBadges = [], onContinue, label = 'Lesson complete!' }) {
  const sounds = useSounds()
  useEffect(() => { sounds.complete() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const pct = total ? Math.round((correct / total) * 100) : 100
  const goalReached = xpToday >= dailyGoal

  return (
    <div className="fixed inset-0 z-50 bg-ink-900 flex flex-col items-center justify-center px-6 text-center safe-top safe-bottom overflow-y-auto py-8">
      <Mascot size={92} className="mb-4 animate-pop" />
      <h1 className="text-2xl font-semibold mb-1">{label}</h1>
      <p className="text-ink-400 mb-7">做得好！ Nice work.</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-4">
        <div className="rounded-xl border border-ink-700 p-4">
          <div className="text-3xl font-bold text-accent">{pct}%</div>
          <div className="text-xs text-ink-400 mt-1">Accuracy</div>
        </div>
        <div className="rounded-xl border border-ink-700 p-4">
          <div className="text-3xl font-bold text-ink-100">+{xp}</div>
          <div className="text-xs text-ink-400 mt-1">XP earned</div>
        </div>
      </div>

      {/* Daily goal + streak */}
      <div className="flex items-center gap-4 w-full max-w-xs mb-5 rounded-xl border border-ink-700 p-3">
        <Ring value={xpToday} max={dailyGoal} size={52} stroke={5}>
          <span className="text-[11px]">{goalReached ? '✓' : '⚡'}</span>
        </Ring>
        <div className="text-left">
          <p className="text-sm font-medium text-white">{goalReached ? 'Daily goal reached!' : `${Math.min(xpToday, dailyGoal)}/${dailyGoal} XP today`}</p>
          <p className="text-xs text-ink-400">🔥 {streak}-day streak</p>
        </div>
      </div>

      {newBadges.length > 0 && (
        <div className="w-full max-w-xs mb-5 space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-ink-400">New achievement{newBadges.length > 1 ? 's' : ''}</p>
          {newBadges.map((b) => <BadgeToast key={b.id} badge={b} />)}
        </div>
      )}

      <div className="w-full max-w-xs">
        <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
      </div>
    </div>
  )
}
