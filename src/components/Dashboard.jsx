import { PinyinToggle } from './ui/common'
import Mascot from './duo/Mascot'

const PERSON = 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z'

// Minimal mobile top bar: panda + account + pinyin toggle.
export default function Dashboard({ onOpenAccount, signedIn }) {
  return (
    <div className="px-5 pt-4 pb-2 flex items-center justify-between">
      <Mascot size={40} />
      <div className="flex items-center gap-2">
        <button onClick={onOpenAccount} className="relative w-9 h-9 rounded-lg border border-ink-700 grid place-items-center text-ink-300 active:scale-95" aria-label="Account">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d={PERSON} /></svg>
          {signedIn && <span className="absolute right-1 top-1 w-2 h-2 rounded-full bg-accent" />}
        </button>
        <PinyinToggle />
      </div>
    </div>
  )
}
