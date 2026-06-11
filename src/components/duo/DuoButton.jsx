// Duolingo-style 3D button. `color` picks the face + darker rim.
const COLORS = {
  green: { bg: '#58cc02', rim: '#4caf00', text: '#fff' },
  blue: { bg: '#1cb0f6', rim: '#1899d6', text: '#fff' },
  gold: { bg: '#ffc800', rim: '#e0a800', text: '#1b2a32' },
  red: { bg: '#ff4b4b', rim: '#ea2b2b', text: '#fff' },
  grey: { bg: '#202f36', rim: '#37464f', text: '#93a1ab' },
  white: { bg: '#ffffff', rim: '#e2e8ec', text: '#1b2a32' },
}

export default function DuoButton({ color = 'green', children, className = '', style, ...props }) {
  const c = COLORS[color] || COLORS.green
  return (
    <button
      {...props}
      className={`duo3d uppercase text-sm px-5 py-3 ${className}`}
      style={{ background: c.bg, color: c.text, '--rim': c.rim, ...style }}
    >
      {children}
    </button>
  )
}
