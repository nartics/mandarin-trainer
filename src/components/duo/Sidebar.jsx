const ITEMS = [
  { id: 'learn', label: 'Learn', icon: 'M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z' },
  { id: 'listen', label: 'Listen', icon: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z' },
  { id: 'write', label: 'Write', icon: 'M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
  { id: 'review', label: 'Review', icon: 'M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z' },
  { id: 'words', label: 'Words', icon: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z' },
]

export default function Sidebar({ tab, onChange, dueCount = 0, className = '' }) {
  return (
    <aside className={`w-[240px] shrink-0 border-r border-duo-border px-3 py-5 flex flex-col ${className}`}>
      <div className="px-3 mb-6">
        <span className="text-3xl font-extrabold text-duo-green tracking-tight han">汉语</span>
        <span className="block text-[11px] font-bold tracking-widest text-duo-muted mt-0.5">HSK 1 TRAINER</span>
      </div>

      <nav className="flex flex-col gap-1.5">
        {ITEMS.map((it) => {
          const on = tab === it.id
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={`relative flex items-center gap-3 px-3 py-3 rounded-xl border-2 font-extrabold uppercase text-sm tracking-wide transition
                ${on ? 'bg-duo-blue/15 border-duo-blue/60 text-duo-blue'
                     : 'border-transparent text-duo-text/80 hover:bg-white/5'}`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d={it.icon} /></svg>
              {it.label}
              {it.id === 'review' && dueCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-duo-red text-white text-[11px] grid place-items-center">{dueCount}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-duo-card2 border-2 border-duo-border p-4">
        <p className="font-extrabold text-sm mb-1">Master HSK 1 汉语</p>
        <p className="text-xs text-duo-muted leading-snug">Following your Manhattan Mandarin class — chapters 1–15.</p>
      </div>
    </aside>
  )
}
