import { useEffect } from 'react'
import { useSounds } from '../hooks/useSounds'
import { PrimaryButton } from './ui/common'

export default function LessonComplete({ correct, total, xp, onContinue, label = 'Lesson complete!' }) {
  const sounds = useSounds()
  useEffect(() => { sounds.complete() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const pct = total ? Math.round((correct / total) * 100) : 100
  return (
    <div className="fixed inset-0 z-50 bg-ink-900 flex flex-col items-center justify-center px-6 text-center safe-top safe-bottom">
      <div className="text-7xl mb-4 animate-pop">🎉</div>
      <h1 className="text-3xl font-bold mb-1">{label}</h1>
      <p className="text-slate-400 mb-8">做得好！ Nice work.</p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-10">
        <div className="rounded-2xl bg-ink-800 border border-white/10 p-4">
          <div className="text-3xl font-bold text-jade-400">{pct}%</div>
          <div className="text-xs text-slate-400 mt-1">Accuracy</div>
        </div>
        <div className="rounded-2xl bg-ink-800 border border-white/10 p-4">
          <div className="text-3xl font-bold text-gold-400">+{xp}</div>
          <div className="text-xs text-slate-400 mt-1">XP earned</div>
        </div>
      </div>
      <div className="w-full max-w-xs">
        <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
      </div>
    </div>
  )
}
