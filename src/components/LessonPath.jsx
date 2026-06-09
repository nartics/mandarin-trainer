import { LESSONS, lessonWords } from '../data/vocab'
import { deriveMastery, defaultCard } from '../lib/sm2'

export default function LessonPath({ progress, onStart }) {
  return (
    <div className="px-5 pb-6">
      <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-3 mt-2">Lesson path</h2>
      <div className="relative">
        {LESSONS.map((lesson, i) => {
          const words = lessonWords(lesson.id)
          const mastered = words.filter((w) => {
            const m = deriveMastery(progress.cardFor(w.id) || defaultCard())
            return m === 'mastered' || m === 'familiar'
          }).length
          const seen = words.filter((w) => progress.cardFor(w.id)).length
          const pct = Math.round((mastered / words.length) * 100)
          const started = seen > 0
          const done = pct >= 100
          const side = i % 2 === 0 ? 'self-start' : 'self-end'
          return (
            <div key={lesson.id} className={`flex flex-col mb-3`}>
              <button
                onClick={() => onStart(lesson.id)}
                className={`${side} w-[78%] text-left rounded-2xl p-4 border transition active:scale-[0.99]
                  ${done ? 'bg-jade-600/15 border-jade-500/40' : started ? 'bg-ink-800 border-white/15' : 'bg-ink-800 border-white/10'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl grid place-items-center text-2xl shrink-0
                    ${done ? 'bg-jade-500/25' : 'bg-ink-700'}`}>
                    {done ? '✓' : lesson.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate">{lesson.title}</h3>
                      <span className="text-xs text-slate-500 shrink-0">{words.length} words</span>
                    </div>
                    <div className="h-2 rounded-full bg-ink-700 overflow-hidden mt-2">
                      <div className="h-full bg-jade-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
