import { useState } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import { deriveMastery, defaultCard } from '../lib/sm2'
import { chapterResources, PORTAL } from '../data/resources'
import { annotate } from '../lib/pinyin'
import { MASTERY_COLORS, PrimaryButton } from './ui/common'

export default function ChapterDetail({ chapter, progress, onClose, onPractice, onOpenGrammar }) {
  const { speak } = useSpeech()
  const [tab, setTab] = useState('vocab')
  const [showExt, setShowExt] = useState(false)
  const res = chapterResources(chapter.num)

  const TABS = [
    { id: 'vocab', label: `Vocab ${chapter.coreWords.length}` },
    { id: 'grammar', label: `Grammar ${chapter.grammar.length}` },
    { id: 'resources', label: 'Resources' },
  ]

  return (
    <div className="fixed inset-0 z-40 bg-ink-900 flex flex-col safe-top">
      {/* Header */}
      <div className="px-4 pt-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-slate-400 text-2xl px-1">←</button>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-500">Ch {chapter.num}</span>
              {chapter.status === 'current' && <span className="text-[10px] text-gold-400">📍 current</span>}
            </div>
            <h2 className="font-bold han text-lg leading-tight truncate">{chapter.titleZh}</h2>
            <p className="text-xs text-slate-400">{chapter.pinyin} · {chapter.en}</p>
          </div>
        </div>
        <div className="flex gap-1.5 mt-3">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${tab === t.id ? 'bg-jade-500 text-ink-900' : 'bg-ink-700 text-slate-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 pb-28">
        <div className="max-w-md mx-auto">
          {tab === 'vocab' && (
            <div className="space-y-2">
              {chapter.coreWords.map((w) => {
                const m = deriveMastery(progress.cardFor(w.id) || defaultCard())
                return (
                  <button key={w.id} onClick={() => speak(w.hanzi, { rate: 0.8 })}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-ink-800 border border-white/10 text-left active:bg-ink-700">
                    <span className="han text-3xl w-14 text-center">{w.hanzi}</span>
                    <span className="flex-1 min-w-0">
                      <span className="tone1 block">{w.pinyin}</span>
                      <span className="text-slate-400 text-sm">{w.en}</span>
                    </span>
                    <span className={`text-[10px] px-2 py-1 rounded-full ${MASTERY_COLORS[m]}`}>{m}</span>
                  </button>
                )
              })}

              {chapter.extensionVocab.length > 0 && (
                <div className="pt-2">
                  <button onClick={() => setShowExt((v) => !v)}
                    className="w-full flex items-center justify-between text-xs uppercase tracking-wide text-slate-400 px-1 py-2">
                    <span>From class · extension ({chapter.extensionVocab.length})</span>
                    <span>{showExt ? '−' : '+'}</span>
                  </button>
                  {showExt && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-slate-500 px-1 mb-1">Extra words your teacher added — beyond the HSK 1 exam list.</p>
                      {chapter.extensionVocab.map((w) => (
                        <button key={w.id} onClick={() => speak(w.hanzi, { rate: 0.8 })}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-ink-800/60 border border-white/5 text-left active:bg-ink-700">
                          <span className="han text-2xl w-12 text-center">{w.hanzi}</span>
                          <span className="flex-1 min-w-0">
                            <span className="tone1 block text-sm">{w.pinyin}</span>
                            <span className="text-slate-400 text-xs">{w.en}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'grammar' && (
            <div className="space-y-2.5">
              {chapter.grammar.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No new grammar point in this chapter — focus on vocab.</p>}
              {chapter.grammar.map((g) => {
                const gp = progress.grammarFor(g.id)
                return (
                  <button key={g.id} onClick={() => onOpenGrammar(g)}
                    className="w-full text-left rounded-2xl bg-ink-800 border border-white/10 p-4 active:bg-ink-700">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold">{g.title}</h3>
                      {gp && <span className="text-[10px] text-jade-400">✓ practiced</span>}
                    </div>
                    <p className="text-sky-400 text-sm han mt-0.5">{g.patternZh}</p>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{g.summary}</p>
                  </button>
                )
              })}
            </div>
          )}

          {tab === 'resources' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">🎧 Native listening · ChinesePod</h3>
                <div className="space-y-2">
                  {res.chinesepod?.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 p-3 rounded-xl bg-ink-800 border border-white/10 active:bg-ink-700">
                      <span className="text-sky-400">▶</span>
                      <span className="text-sm flex-1">{p.title}</span>
                      <span className="text-slate-600 text-xs">↗</span>
                    </a>
                  ))}
                </div>
              </div>
              {res.quizlet && (
                <a href={res.quizlet} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-ink-800 border border-white/10 active:bg-ink-700">
                  <span>🗂️</span><span className="text-sm flex-1">Quizlet flashcards · HSK 1.{chapter.num}</span><span className="text-slate-600 text-xs">↗</span>
                </a>
              )}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ink-800 border border-white/10">
                <span>📘</span><span className="text-sm flex-1 text-slate-300">HSK Standard Course 1 · Lesson {chapter.num}</span>
              </div>
              <p className="text-[11px] text-slate-500">{PORTAL.note}</p>
            </div>
          )}
        </div>
      </div>

      {/* Practice CTA */}
      <div className="fixed bottom-0 inset-x-0 safe-bottom bg-ink-900/95 backdrop-blur border-t border-white/10">
        <div className="max-w-md mx-auto px-5 py-4">
          <PrimaryButton onClick={() => onPractice(chapter)}>Practice this chapter</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
