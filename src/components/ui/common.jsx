import { annotate } from '../../lib/pinyin'
import { useSettings } from '../../hooks/useSettings'

// Pinyin rendered above each hanzi, colored by tone. Visibility follows the global
// pinyin toggle; pass showPinyin={false} to force-hide regardless of the setting.
export function Annotated({ text, size = 'text-3xl', pinyinSize = 'text-sm', gap = 'gap-x-1', showPinyin = true }) {
  const { showPinyin: global } = useSettings()
  const show = global && showPinyin !== false
  const segs = annotate(text)
  return (
    <div className={`flex flex-wrap items-end ${gap} justify-center`}>
      {segs.map((s, i) => (
        <div key={i} className="flex flex-col items-center leading-tight">
          {show && s.pinyin && (
            <span className={`${pinyinSize} tone${s.tone} font-medium`}>{s.pinyin}</span>
          )}
          <span className={`${size} han ${s.hanzi === ' ' ? 'w-2' : ''}`}>{s.hanzi}</span>
        </div>
      ))}
    </div>
  )
}

export function Pinyin({ text, className = '' }) {
  const { showPinyin } = useSettings()
  const segs = annotate(text)
  return (
    <span className={className}>
      {segs.map((s, i) => (
        <span key={i} className={s.tone ? `tone${s.tone}` : ''}>{showPinyin ? (s.pinyin || s.hanzi) : s.hanzi}</span>
      ))}
    </span>
  )
}

// Small chip to toggle pinyin visibility across the whole app.
export function PinyinToggle({ className = '' }) {
  const { showPinyin, toggle } = useSettings()
  return (
    <button
      onClick={toggle}
      aria-pressed={showPinyin}
      title={showPinyin ? 'Hide pinyin' : 'Show pinyin'}
      className={`shrink-0 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition active:scale-95
        ${showPinyin ? 'bg-accent-soft border-accent/40 text-accent' : 'bg-transparent border-ink-600 text-ink-400'} ${className}`}
    >
      <span className="han">拼音</span> {showPinyin ? 'On' : 'Off'}
    </button>
  )
}

// Annotated sentence segment that respects the global pinyin toggle. Used where a
// sentence is rendered char-by-char with small pinyin above each glyph.
export function SentenceLine({ text, size = 'text-2xl', pinyinSize = 'text-[10px]', className = '' }) {
  const { showPinyin } = useSettings()
  return (
    <span className={`flex flex-wrap gap-x-0.5 ${className}`}>
      {annotate(text).map((s, i) => (
        <span key={i} className="flex flex-col items-center leading-tight">
          {showPinyin && <span className={`${pinyinSize} tone${s.tone}`}>{s.pinyin}</span>}
          <span className={`han ${size}`}>{s.hanzi}</span>
        </span>
      ))}
    </span>
  )
}

export function SpeakerButton({ onClick, speaking, size = 'w-14 h-14', big }) {
  return (
    <button
      onClick={onClick}
      className={`${size} shrink-0 rounded-2xl bg-ink-800 border border-ink-600 grid place-items-center
        active:scale-95 transition ${speaking ? 'text-accent ring-2 ring-accent/40' : 'text-ink-200'}`}
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
  const base = 'w-full text-left px-4 py-3.5 rounded-xl border text-lg transition active:scale-[0.99] '
  const styles = {
    idle: 'bg-ink-800 border-ink-600 hover:border-ink-500',
    correct: 'bg-accent-soft border-accent text-white',
    wrong: 'bg-cinnabar-600/20 border-cinnabar-500/60 text-cinnabar-100 animate-shake',
    muted: 'bg-ink-800 border-ink-700 opacity-40',
  }
  return (
    <button disabled={disabled} onClick={onClick} className={base + (styles[state] || styles.idle)}>
      {children}
    </button>
  )
}

export function PrimaryButton({ children, onClick, disabled, color = 'jade', className = '' }) {
  const colors = {
    jade: 'bg-accent hover:bg-accent/90 text-ink-900',
    cinnabar: 'bg-cinnabar-500 hover:bg-cinnabar-400 text-white',
    gold: 'bg-transparent border border-ink-600 text-white hover:bg-white/5',
    ghost: 'bg-ink-700 hover:bg-ink-600 text-white border border-ink-600',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 rounded-xl font-medium text-base transition active:scale-[0.98]
        disabled:opacity-40 disabled:active:scale-100 ${colors[color]} ${className}`}
    >
      {children}
    </button>
  )
}

const FLAME = 'M12 2c-1 3-4 5-4 9a5 5 0 1 0 10 0c0-2-.8-4-2-5.5-1 2-3 3-4 2.5C12 7.5 12 4 12 2z'
const BOLT  = 'M13 2L3 14h7l-1 8 10-12h-7l1-8z'

export function FlameIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d={FLAME} /></svg>
}
export function BoltIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d={BOLT} /></svg>
}

export const MASTERY_COLORS = {
  new: 'bg-ink-700 text-ink-400',
  learning: 'bg-accent-soft text-accent',
  familiar: 'bg-accent-soft text-accent',
  mastered: 'bg-accent text-ink-900',
}
