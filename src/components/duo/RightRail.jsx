import { PinyinToggle } from '../ui/common'
import DuoButton from './DuoButton'

export default function RightRail({ chapter, onPractice, className = '' }) {
  if (!chapter) return <aside className={className} />
  return (
    <aside className={`w-[300px] shrink-0 px-6 py-7 ${className}`}>
      <div className="flex justify-end mb-8">
        <PinyinToggle />
      </div>

      <p className="text-[11px] uppercase tracking-wider text-ink-400 mb-1.5">Chapter {chapter.num}</p>
      <p className="han text-lg text-white leading-tight">{chapter.titleZh}</p>
      <p className="text-sm text-ink-400 mb-3">{chapter.en}</p>
      <DuoButton color="accent" className="w-full" onClick={() => onPractice(chapter)}>Continue</DuoButton>
    </aside>
  )
}
