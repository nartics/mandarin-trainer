const TABS = [
  { id: 'learn', label: 'Learn', icon: 'M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z' },
  { id: 'listen', label: 'Listen', icon: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z' },
  { id: 'write', label: 'Write', icon: 'M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
  { id: 'review', label: 'Review', icon: 'M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z' },
  { id: 'words', label: 'Words', icon: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z' },
]

export default function BottomNav({ active, onChange, dueCount }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-ink-800/95 backdrop-blur border-t border-white/10 safe-bottom">
      <div className="max-w-md mx-auto flex">
        {TABS.map((t) => {
          const on = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 relative ${on ? 'text-jade-400' : 'text-slate-500'}`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d={t.icon} /></svg>
              <span className="text-[10px]">{t.label}</span>
              {t.id === 'review' && dueCount > 0 && (
                <span className="absolute top-1 right-[28%] min-w-[16px] h-4 px-1 rounded-full bg-cinnabar-500 text-white text-[9px] grid place-items-center">{dueCount}</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
