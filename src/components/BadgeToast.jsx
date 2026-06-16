// A newly-earned badge, shown on the session-complete screen.
export default function BadgeToast({ badge }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-accent/40 bg-accent-soft px-3 py-2.5 animate-pop">
      <span className="text-2xl leading-none">{badge.icon}</span>
      <span className="min-w-0 text-left">
        <span className="block text-sm font-semibold text-white truncate">{badge.name}</span>
        <span className="block text-xs text-ink-300 truncate">{badge.desc}</span>
      </span>
      <span className="ml-auto text-[10px] uppercase tracking-wider text-accent font-semibold">New</span>
    </div>
  )
}
