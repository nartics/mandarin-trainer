// A friendly panda mascot — the app's "Duo", on-theme for Chinese.
export default function Mascot({ size = 96, className = '' }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} aria-hidden="true">
      {/* ears */}
      <circle cx="30" cy="28" r="16" fill="#222" />
      <circle cx="90" cy="28" r="16" fill="#222" />
      {/* head */}
      <circle cx="60" cy="62" r="42" fill="#fff" />
      {/* eye patches */}
      <ellipse cx="44" cy="58" rx="12" ry="15" fill="#222" transform="rotate(-12 44 58)" />
      <ellipse cx="76" cy="58" rx="12" ry="15" fill="#222" transform="rotate(12 76 58)" />
      {/* eyes */}
      <circle cx="46" cy="59" r="5" fill="#fff" />
      <circle cx="74" cy="59" r="5" fill="#fff" />
      <circle cx="47" cy="60" r="2.4" fill="#222" />
      <circle cx="73" cy="60" r="2.4" fill="#222" />
      {/* nose + mouth */}
      <ellipse cx="60" cy="74" rx="5" ry="3.6" fill="#222" />
      <path d="M60 78 q-7 8 -14 3 M60 78 q7 8 14 3" stroke="#222" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="38" cy="74" r="5" fill="#ffd0d6" opacity="0.7" />
      <circle cx="82" cy="74" r="5" fill="#ffd0d6" opacity="0.7" />
    </svg>
  )
}
