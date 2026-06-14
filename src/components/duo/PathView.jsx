import { useEffect, useRef } from 'react'
import { CHAPTERS, CURRENT_CHAPTER } from '../../data/chapters'
import { deriveMastery, defaultCard } from '../../lib/sm2'
import Mascot from './Mascot'

const ICON = {
  star: 'M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z',
  book: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z',
  bolt: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
  check: 'M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z',
  lock: 'M12 1a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm3 7H9V6a3 3 0 0 1 6 0v2z',
}

function Glyph({ name, className }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d={ICON[name]} /></svg>
}

function PathNode({ node, active }) {
  const glyph = node.done ? 'check' : node.locked ? 'lock' : node.icon
  let cls
  if (node.locked) cls = 'bg-ink-800 border-ink-700 text-ink-600'
  else if (node.done) cls = 'bg-accent border-accent text-ink-900'
  else cls = `bg-ink-800 border-ink-600 text-ink-100 ${active ? 'ring-2 ring-accent ring-offset-2 ring-offset-ink-900' : ''}`
  return (
    <button
      disabled={node.locked}
      onClick={node.onClick}
      title={node.title}
      className={`node relative w-14 h-14 grid place-items-center border ${cls} ${node.locked ? 'cursor-default' : ''}`}
    >
      <Glyph name={glyph} className="w-6 h-6" />
    </button>
  )
}

export default function PathView({ progress, onOpenChapter, onOpenGrammar, onPractice }) {
  const currentRef = useRef(null)
  // Open the path at the chapter the class is on — defer past first paint so layout is settled.
  useEffect(() => {
    const t = setTimeout(() => currentRef.current?.scrollIntoView({ block: 'center' }), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="max-w-[460px] mx-auto px-6 pb-24">
      {CHAPTERS.map((c) => {
        const locked = c.status === 'upcoming'
        const current = c.num === CURRENT_CHAPTER
        const learned = c.coreWords.filter((w) => {
          const m = deriveMastery(progress.cardFor(w.id) || defaultCard())
          return m === 'mastered' || m === 'familiar'
        }).length
        const pct = c.coreWords.length ? learned / c.coreWords.length : 0

        const nodes = []
        nodes.push({ icon: 'book', done: learned > 0, locked, title: `Chapter ${c.num} vocab`, onClick: () => onOpenChapter(c.num) })
        for (const g of c.grammar) {
          const gp = progress.grammarFor(g.id)
          nodes.push({ icon: 'bolt', done: !!(gp && gp.correct > 0), locked, title: g.title, onClick: () => onOpenGrammar(g) })
        }
        nodes.push({ icon: 'star', done: pct >= 1, locked, title: 'Practice this chapter', onClick: () => onPractice(c) })

        const activeIdx = current ? nodes.findIndex((n) => !n.done && !n.locked) : -1

        return (
          <section key={c.num} ref={current ? currentRef : null} className="mb-14 scroll-mt-10">
            {/* Quiet chapter header */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-ink-400">
                  Chapter {c.num}
                </span>
                {current && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h2 className={`text-lg han ${locked ? 'text-ink-500' : 'text-white'}`}>{c.titleZh}</h2>
                  <p className="text-sm text-ink-400 truncate">{c.en}</p>
                </div>
                <button
                  onClick={() => onOpenChapter(c.num)}
                  className="shrink-0 text-xs font-medium text-ink-300 hover:text-white transition"
                >
                  Open →
                </button>
              </div>
              <div className="h-px bg-ink-700 mt-4" />
            </div>

            {/* Straight node column with a connector line */}
            <div className="relative flex flex-col items-center gap-6">
              <div className="absolute top-7 bottom-7 w-px bg-ink-700" />
              {nodes.map((n, i) => (
                <div key={i} className="relative">
                  <PathNode node={n} active={i === activeIdx} />
                  {i === activeIdx && (
                    <>
                      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Mascot size={64} className="animate-bobble" />
                        <span className="text-xs font-medium text-accent whitespace-nowrap">Start here</span>
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
