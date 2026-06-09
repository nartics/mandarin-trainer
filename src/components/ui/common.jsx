import { annotate } from '../../lib/pinyin'

// Pinyin rendered above each hanzi, colored by tone.
export function Annotated({ text, size = 'text-3xl', pinyinSize = 'text-sm', gap = 'gap-x-1', showPinyin = true }) {
  const segs = annotate(text)
  return (
    <div className={`flex flex-wrap items-end ${gap} justify-center`}>
      {segs.map((s, i) => (
        <div key={i} className="flex flex-col items-center leading-tight">
          {showPinyin && s.pinyin && (
            <span className={`${pinyinSize} tone${s.tone} font-medium`}>{s.pinyin}</span>
          )}
          <span className={`${size} han ${s.hanzi === ' ' ? 'w-2' : ''}`}>{s.hanzi}</span>
        </div>
      ))}
    </div>
  )
}

export function Pinyin({ text, className = '' }) {
  const segs = annotate(text)
  return (
    <span className={className}>
      {segs.map((s, i) => (
        <span key={i} className={s.tone ? `tone${s.tone}` : ''}>{s.pinyin || s.hanzi}</span>
      ))}
    </span>
  )
}

export function SpeakerButton({ onClick, speaking, size = 'w-14 h-14', big }) {
  return (
    <button
      onClick={onClick}
      className={`${size} shrink-0 rounded-2xl bg-ink-700 border border-white/10 grid place-items-center
        active:scale-95 transition ${speaking ? 'text-cinnabar-400 ring-2 ring-cinnabar-400/50' : 'text-sky-300'}`}
      aria-label="Play audio"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={big ? 'w-9 h-9' : 'w-7 h-7'}>
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zm-2.5-9.5v2.06A7 7 0 0 1 14 18.94V21a9 9 0 0 0 0-18.5z" />
      </svg>
    </button>
  )
}

export function ProgressBar({ value, max, className = '' }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className={`h-3 rounded-full bg-ink-700 overflow-hidden ${className}`}>
      <div className="h-full bg-jade-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Choice({ children, state, onClick, disabled }) {
  // state: 'idle' | 'correct' | 'wrong' | 'muted'
  const base = 'w-full text-left px-4 py-4 rounded-2xl border text-lg transition active:scale-[0.99] '
  const styles = {
    idle: 'bg-ink-700 border-white/10 hover:border-white/25',
    correct: 'bg-jade-600/30 border-jade-400 text-jade-100',
    wrong: 'bg-cinnabar-600/30 border-cinnabar-400 text-cinnabar-100 animate-shake',
    muted: 'bg-ink-800 border-white/5 opacity-50',
  }
  return (
    <button disabled={disabled} onClick={onClick} className={base + (styles[state] || styles.idle)}>
      {children}
    </button>
  )
}

export function PrimaryButton({ children, onClick, disabled, color = 'jade', className = '' }) {
  const colors = {
    jade: 'bg-jade-500 hover:bg-jade-400 text-ink-900',
    cinnabar: 'bg-cinnabar-500 hover:bg-cinnabar-400 text-white',
    gold: 'bg-gold-500 hover:bg-gold-400 text-ink-900',
    ghost: 'bg-ink-700 hover:bg-ink-600 text-white border border-white/10',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl font-semibold text-lg transition active:scale-[0.98]
        disabled:opacity-40 disabled:active:scale-100 ${colors[color]} ${className}`}
    >
      {children}
    </button>
  )
}

export const MASTERY_COLORS = {
  new: 'bg-ink-600 text-slate-300',
  learning: 'bg-gold-500/20 text-gold-400',
  familiar: 'bg-sky-500/20 text-sky-300',
  mastered: 'bg-jade-500/20 text-jade-400',
}
