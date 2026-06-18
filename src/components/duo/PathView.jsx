import { useEffect, useRef } from 'react'
import { CHAPTERS, activeChapterNum } from '../../data/chapters'
import { chapterLessons } from '../../lib/queue'
import { deriveMastery, defaultCard } from '../../lib/sm2'

const ICON = {
  star: 'M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z',
  bolt: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
  check: 'M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z',
  lock: 'M12 1a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm3 7H9V6a3 3 0 0 1 6 0v2z',
}

function Glyph({ name, className }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d={ICON[name]} /></svg>
}

function LessonNode({ hasGrammar, done, locked, active, onClick, title }) {
  const icon = done ? 'check' : hasGrammar ? 'bolt' : 'star'
  let cls
  if (locked) cls = 'bg-ink-800 border-ink-700 text-ink-600'
  else if (done) cls = 'bg-accent border-accent text-ink-900'
  else cls = `bg-ink-800 border-ink-600 text-ink-100 ${active ? 'ring-2 ring-accent ring-offset-2 ring-offset-ink-900' : ''}`
  return (
    <button
      disabled={locked}
      onClick={onClick}
      title={title}
      className={`node relative w-14 h-14 grid place-items-center border ${cls} ${locked ? 'cursor-default' : ''}`}
    >
      <Glyph name={icon} className="w-6 h-6" />
    </button>
  )
}

export default function PathView({ progress, onOpenChapter, onPractice }) {
  const currentRef = useRef(null)
  const activeNum = activeChapterNum(progress)
  useEffect(() => {
    const t = setTimeout(() => currentRef.current?.scrollIntoView({ block: 'center' }), 80)
    return () => clearTimeout(t)
  }, [activeNum])

  return (
    <div className="max-w-[460px] mx-auto px-6 pb-24">
      {CHAPTERS.map((c) => {
        const chapterLocked = c.status === 'upcoming'
        const current = c.num === activeNum
        const learned = c.coreWords.filter((w) => {
          const m = deriveMastery(progress.cardFor(w.id) || defaultCard())
          return m === 'mastered' || m === 'familiar'
        }).length
        const pct = c.coreWords.length ? learned / c.coreWords.length : 0

        const lessons = chapterLessons(c)
        const activeIdx = current
          ? lessons.findIndex((_, i) => !progress.state.lessonsDone?.[`ch${c.num}-l${i}`])
          : -1

        return (
          <section key={c.num} ref={current ? currentRef : null} className="mb-14 scroll-mt-10">
            {/* Chapter header */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-ink-400">
                  Chapter {c.num}
                </span>
                {current && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h2 className={`text-lg han ${chapterLocked ? 'text-ink-500' : 'text-white'}`}>{c.titleZh}</h2>
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

            {/* Lesson nodes */}
            <div className="relative flex flex-col items-center gap-6">
              <div className="absolute top-7 bottom-7 w-px bg-ink-700" />
              {lessons.map((lesson, i) => {
                const lessonId = `ch${c.num}-l${i}`
                const done = !!(progress.state.lessonsDone?.[lessonId])
                const prevDone = i === 0 || !!(progress.state.lessonsDone?.[`ch${c.num}-l${i - 1}`])
                const locked = chapterLocked || !prevDone
                return (
                  <div key={i} className="relative">
                    <LessonNode
                      hasGrammar={lesson.grammar.length > 0}
                      done={done}
                      locked={locked}
                      active={activeIdx >= 0 && i === activeIdx}
                      onClick={() => onPractice(c, i)}
                      title={`Lesson ${i + 1}${lesson.grammar.length ? ' · Grammar' : ''}`}
                    />
                  </div>
                )
              })}
            </div>

            {/* Word progress bar for done chapters */}
            {!chapterLocked && pct > 0 && (
              <div className="mt-6 px-2">
                <div className="h-1 rounded-full bg-ink-700 overflow-hidden">
                  <div className="h-full bg-accent/50 transition-all" style={{ width: `${pct * 100}%` }} />
                </div>
                <p className="text-[10px] text-ink-500 mt-1 text-center">{learned}/{c.coreWords.length} words familiar+</p>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
