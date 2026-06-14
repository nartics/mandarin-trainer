import { PinyinToggle } from './ui/common'
import Mascot from './duo/Mascot'

// Minimal mobile top bar: panda + pinyin toggle.
export default function Dashboard() {
  return (
    <div className="px-5 pt-4 pb-2 flex items-center justify-between">
      <Mascot size={40} />
      <PinyinToggle />
    </div>
  )
}
