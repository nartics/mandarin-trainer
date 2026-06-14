import { CHAPTER_BY_NUM, CURRENT_CHAPTER } from '../../data/chapters'
import { PinyinToggle } from '../ui/common'
import DuoButton from './DuoButton'

export default function RightRail({ onPractice, className = '' }) {
  const cur = CHAPTER_BY_NUM[CURRENT_CHAPTER]
  return (
    <aside className={`w-[300px] shrink-0 px-6 py-7 ${className}`}>
      <div className="flex justify-end mb-8">
        <PinyinToggle />
      </div>

      <p className="text-[11px] uppercase tracking-wider text-ink-400 mb-1.5">Chapter {cur.num}</p>
      <p className="han text-lg text-white leading-tight">{cur.titleZh}</p>
      <p className="text-sm text-ink-400 mb-3">{cur.en}</p>
      <DuoButton color="accent" className="w-full" onClick={() => onPractice(cur)}>Continue</DuoButton>
    </aside>
  )
}
