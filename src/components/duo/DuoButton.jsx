// Flat, minimal button. `color` picks a quiet treatment.
const STYLES = {
  accent: 'bg-accent text-ink-900 hover:bg-accent/90',
  ghost: 'bg-transparent text-white border border-ink-600 hover:bg-white/5',
  subtle: 'bg-ink-700 text-white hover:bg-ink-600',
}

export default function DuoButton({ color = 'accent', children, className = '', ...props }) {
  return (
    <button {...props} className={`flatbtn px-4 py-2.5 text-sm ${STYLES[color] || STYLES.accent} ${className}`}>
      {children}
    </button>
  )
}
