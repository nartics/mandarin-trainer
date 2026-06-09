import { useState } from 'react'
import { LESSONS, lessonWords } from '../data/vocab'
import { useSpeech } from '../hooks/useSpeech'
import { deriveMastery, defaultCard } from '../lib/sm2'
import { annotate } from '../lib/pinyin'
import { MASTERY_COLORS } from './ui/common'

export default function WordBrowser({ progress }) {
  const { speak } = useSpeech()
  const [open, setOpen] = useState(null)
  const [q, setQ] = useState('')

  return (
    <div className="px-5 pb-6">
      <h2 className="text-xl font-bold mb-1 mt-2">Vocabulary 词汇</h2>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search hanzi, pinyin or meaning…"
        className="w-full mb-4 px-4 py-3 rounded-xl bg-ink-800 border border-white/10 text-base outline-none focus:border-white/30"
      />
      {LESSONS.map((lesson) => {
        const words = lessonWords(lesson.id).filter((w) =>
          !q || w.hanzi.includes(q) || w.pinyin.toLowerCase().includes(q.toLowerCase()) || w.en.toLowerCase().includes(q.toLowerCase())
        )
        if (!words.length) return null
        return (
          <div key={lesson.id} className="mb-5">
            <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">{lesson.icon} {lesson.title}</h3>
            <div className="flex flex-col gap-2">
              {words.map((w) => {
                const m = deriveMastery(progress.cardFor(w.id) || defaultCard())
                const expanded = open === w.id
                return (
                  <div key={w.id} className="rounded-2xl bg-ink-800 border border-white/10 overflow-hidden">
                    <button
                      onClick={() => { setOpen(expanded ? null : w.id); speak(w.hanzi, { rate: 0.8 }) }}
                      className="w-full flex items-center gap-3 p-3 text-left active:bg-ink-700"
                    >
                      <span className="han text-3xl w-16 text-center">{w.hanzi}</span>
                      <span className="flex-1 min-w-0">
                        <span className="tone1 block">{w.pinyin}</span>
                        <span className="text-slate-400 text-sm">{w.en}</span>
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-full ${MASTERY_COLORS[m]}`}>{m}</span>
                    </button>
                    {expanded && w.ex && (
                      <button onClick={() => speak(w.ex[0], { rate: 0.85 })} className="w-full text-left px-3 pb-3 pt-0">
                        <div className="rounded-xl bg-ink-900/60 p-3 flex items-center gap-2">
                          <span className="text-sky-400 text-lg">🔊</span>
                          <span className="flex flex-col">
                            <span className="flex flex-wrap gap-x-0.5">
                              {annotate(w.ex[0]).map((s, i) => (
                                <span key={i} className="flex flex-col items-center leading-tight">
                                  <span className={`text-[10px] tone${s.tone}`}>{s.pinyin}</span>
                                  <span className="han text-lg">{s.hanzi}</span>
                                </span>
                              ))}
                            </span>
                            <span className="text-slate-400 text-sm mt-1">{w.ex[1]}</span>
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
