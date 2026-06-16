import Mascot from './Mascot'

const ITEMS = [
  { id: 'learn', label: 'Learn', icon: 'M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z' },
  { id: 'listen', label: 'Listen', icon: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z' },
  { id: 'write', label: 'Write', icon: 'M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
  { id: 'review', label: 'Review', icon: 'M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z' },
  { id: 'words', label: 'Words', icon: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z' },
]

const PERSON = 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z'

export default function Sidebar({ tab, onChange, dueCount = 0, onOpenAccount, onOpenProfile, streak = 0, syncStatus, signedIn, className = '' }) {
  return (
    <aside className={`w-[220px] shrink-0 border-r border-ink-700 px-4 py-7 flex flex-col ${className}`}>
      <div className="px-1 mb-8 flex items-center justify-between">
        <Mascot size={44} />
        <button onClick={onOpenProfile} title="Your progress" className="flex items-center gap-1 text-sm font-semibold text-ink-200 hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.04] transition">
          🔥<span>{streak}</span>
        </button>
      </div>

      <nav className="flex flex-col gap-0.5">
        {ITEMS.map((it) => {
          const on = tab === it.id
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                ${on ? 'bg-white/5 text-white' : 'text-ink-300 hover:text-white hover:bg-white/[0.03]'}`}
            >
              {on && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-accent" />}
              <svg viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${on ? 'text-accent' : 'text-ink-400 group-hover:text-ink-200'}`}><path d={it.icon} /></svg>
              {it.label}
              {it.id === 'review' && dueCount > 0 && (
                <span className="ml-auto text-[11px] text-ink-400">{dueCount}</span>
              )}
            </button>
          )
        })}
      </nav>

      <button
        onClick={onOpenAccount}
        className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-300 hover:text-white hover:bg-white/[0.03] transition"
      >
        <span className="relative">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-ink-400"><path d={PERSON} /></svg>
          {signedIn && <span className={`absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full ${syncStatus === 'error' ? 'bg-cinnabar-500' : 'bg-accent'}`} />}
        </span>
        {signedIn ? 'Account' : 'Sign in'}
      </button>
    </aside>
  )
}
