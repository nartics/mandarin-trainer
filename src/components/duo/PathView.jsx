import { useEffect, useRef } from 'react'
import { CHAPTERS, CURRENT_CHAPTER } from '../../data/chapters'
import { deriveMastery, defaultCard } from '../../lib/sm2'
import Mascot from './Mascot'

// SVG glyphs drawn white on the node face.
const ICON = {
  star: 'M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z',
  book: 'M4 4h12a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4V4zm16 0v14a2 2 0 0 0-2 2 2 2 0 0 1 2-2V4z',
  bolt: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
  check: 'M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z',
  lock: 'M12 1a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm3 7H9V6a3 3 0 0 1 6 0v2z',
  trophy: 'M18 2H6v2H2v3a4 4 0 0 0 4 4 6 6 0 0 0 5 5v2H8v2h8v-2h-3v-2a6 6 0 0 0 5-5 4 4 0 0 0 4-4V4h-4V2zM6 9a2 2 0 0 1-2-2V6h2v3zm14-2a2 2 0 0 1-2 2V6h2v1z',
}

function NodeGlyph({ name, className }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d={ICON[name]} /></svg>
}

// One round 3D node on the path.
function PathNode({ node, active }) {
  const face = node.locked ? '#37464f' : node.color
  const rim = node.locked ? '#26343c' : node.rim
  const glyph = node.done ? 'check' : node.locked ? 'lock' : node.icon
  return (
    <div className="relative flex flex-col items-center" style={{ transform: `translateX(${node.dx}px)` }}>
      {active && (
        <div className="absolute -top-11 z-10 animate-bobble">
          <div className="relative bg-white text-duo-green font-extrabold text-xs uppercase px-3 py-1.5 rounded-xl shadow-lg">
            Start
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
          </div>
        </div>
      )}
      <button
        disabled={node.locked}
        onClick={node.onClick}
        title={node.title}
        className={`duo-node w-[68px] h-[68px] grid place-items-center ${active ? 'animate-bobble' : ''} ${node.locked ? 'cursor-default' : ''}`}
        style={{ background: face, '--rim': rim }}
      >
        <span className="absolute inset-1.5 rounded-full border-[3px] border-white/25" />
        <NodeGlyph name={glyph} className={`w-8 h-8 ${node.locked ? 'text-duo-bg/70' : 'text-white'}`} />
      </button>
    </div>
  )
}

function SectionHeader({ chapter, locked, current, onOpen }) {
  return (
    <div
      className="duo3d w-full px-5 py-4 flex items-center justify-between mb-2"
      style={locked
        ? { background: '#202f36', '--rim': '#37464f' }
        : { background: '#58cc02', '--rim': '#4caf00' }}
    >
      <div className="min-w-0">
        <p className={`text-[11px] font-extrabold tracking-widest uppercase ${locked ? 'text-duo-muted' : 'text-white/80'}`}>
          Chapter {chapter.num}{current ? ' · current' : ''}
        </p>
        <h2 className={`text-lg font-extrabold truncate ${locked ? 'text-duo-muted' : 'text-white'}`}>
          <span className="han">{chapter.titleZh}</span>
        </h2>
        <p className={`text-xs ${locked ? 'text-duo-muted/70' : 'text-white/80'} truncate`}>{chapter.en}</p>
      </div>
      <button
        onClick={() => onOpen(chapter.num)}
        className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border-2 font-extrabold text-xs uppercase
          ${locked ? 'border-duo-border text-duo-muted' : 'border-white/40 text-white hover:bg-white/10'}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d={ICON.book} /></svg>
        Guidebook
      </button>
    </div>
  )
}

// Gentle S-curve horizontal offset for node index i.
const dxFor = (i) => Math.round(Math.sin(i * 0.7) * 80)

export default function PathView({ progress, onOpenChapter, onOpenGrammar, onPractice }) {
  const currentRef = useRef(null)
  // Open the path at the chapter the class is currently on, like Duolingo.
  useEffect(() => { currentRef.current?.scrollIntoView({ block: 'center' }) }, [])

  return (
    <div className="max-w-[560px] mx-auto px-4 pb-24">
      {CHAPTERS.map((c) => {
        const locked = c.status === 'upcoming'
        const current = c.num === CURRENT_CHAPTER
        const learned = c.coreWords.filter((w) => {
          const m = deriveMastery(progress.cardFor(w.id) || defaultCard())
          return m === 'mastered' || m === 'familiar'
        }).length
        const pct = c.coreWords.length ? learned / c.coreWords.length : 0

        // Build the node list for this chapter.
        const nodes = []
        nodes.push({ icon: 'book', color: '#1cb0f6', rim: '#1899d6', done: learned > 0, locked, title: `Chapter ${c.num} vocab`, onClick: () => onOpenChapter(c.num) })
        for (const g of c.grammar) {
          const gp = progress.grammarFor(g.id)
          nodes.push({ icon: 'bolt', color: '#ce82ff', rim: '#a85fd0', done: !!(gp && gp.correct > 0), locked, title: g.title, onClick: () => onOpenGrammar(g) })
        }
        nodes.push({ icon: 'star', color: '#58cc02', rim: '#4caf00', done: pct >= 1, locked, title: 'Practice this chapter', onClick: () => onPractice(c) })
        if (current) nodes.push({ icon: 'trophy', color: '#ffc800', rim: '#e0a800', done: false, locked: false, title: 'Bonus practice', onClick: () => onPractice(c) })

        // The active node = first not-done node of the current chapter.
        const activeIdx = current ? nodes.findIndex((n) => !n.done && !n.locked) : -1

        return (
          <section key={c.num} ref={current ? currentRef : null} className="mb-10 scroll-mt-8">
            <SectionHeader chapter={c} locked={locked} current={current} onOpen={onOpenChapter} />
            <div className="relative flex flex-col items-center gap-5 pt-6">
              {nodes.map((n, i) => {
                n.dx = dxFor(i)
                const active = i === activeIdx
                return (
                  <div key={i} className="relative w-full flex justify-center">
                    <PathNode node={n} active={active} />
                    {active && (
                      <div className="absolute top-0" style={{ transform: `translateX(${n.dx + 92}px)` }}>
                        <Mascot size={92} className="animate-bobble" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
