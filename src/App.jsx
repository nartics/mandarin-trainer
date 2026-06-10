import { useState, useCallback, useRef } from 'react'
import { useProgress } from './hooks/useProgress'
import { WORDS } from './data/vocab'
import { CHAPTER_BY_NUM, CURRENT_CHAPTER } from './data/chapters'
import { buildQueue, buildChapterQueue, buildGrammarQueue, shuffle } from './lib/queue'
import { isDue } from './lib/sm2'
import Dashboard from './components/Dashboard'
import ChapterPath from './components/ChapterPath'
import ChapterDetail from './components/ChapterDetail'
import GrammarLesson from './components/GrammarLesson'
import BottomNav from './components/BottomNav'
import ExerciseRunner from './components/ExerciseRunner'
import LessonComplete from './components/LessonComplete'
import WriteTrainer from './components/WriteTrainer'
import ListenLab from './components/ListenLab'
import WordBrowser from './components/WordBrowser'
import { PrimaryButton } from './components/ui/common'

export default function App() {
  const progress = useProgress()
  const [tab, setTab] = useState('learn')
  const [openChapter, setOpenChapter] = useState(null) // chapter num
  const [openGrammar, setOpenGrammar] = useState(null) // grammar obj
  const [session, setSession] = useState(null)         // { queue, label }
  const [complete, setComplete] = useState(null)
  const xpAtStart = useRef(0)

  const dueCount = WORDS.filter((w) => { const c = progress.cardFor(w.id); return c && isDue(c) }).length

  const start = useCallback((queue, label) => {
    if (!queue.length) return
    xpAtStart.current = progress.state.xp
    setSession({ queue, label })
  }, [progress.state.xp])

  const startChapter = useCallback((chapter) => start(buildChapterQueue(chapter), `Chapter ${chapter.num} complete!`), [start])
  const startGrammar = useCallback((grammar) => start(buildGrammarQueue(grammar), 'Grammar practiced!'), [start])

  const startReview = useCallback(() => {
    let pool = progress.dueWords()
    if (pool.length < 6) {
      const seen = WORDS.filter((w) => progress.cardFor(w.id))
        .sort((a, b) => (progress.cardFor(a.id)?.interval ?? 0) - (progress.cardFor(b.id)?.interval ?? 0))
      const fresh = WORDS.filter((w) => !progress.cardFor(w.id))
      pool = [...pool, ...[...seen, ...fresh].filter((w) => !pool.includes(w)).slice(0, 12 - pool.length)]
    }
    start(buildQueue(shuffle(pool).slice(0, 14), { includeWrite: false }), 'Review complete!')
  }, [progress, start])

  const onSessionComplete = useCallback((res) => {
    setComplete({ ...res, xp: progress.state.xp - xpAtStart.current, label: session?.label })
    setSession(null)
  }, [progress.state.xp, session])

  const chapter = openChapter != null ? CHAPTER_BY_NUM[openChapter] : null

  return (
    <div className="min-h-full max-w-md mx-auto relative">
      <main className="pb-24 safe-top">
        {tab === 'learn' && (
          <>
            <Dashboard stats={progress.stats} streak={progress.state.streak} xp={progress.state.xp} grammarCount={Object.keys(progress.state.grammar).length} />
            <div className="px-5 mb-2">
              <PrimaryButton color="gold" onClick={startReview}>
                {dueCount > 0 ? `Review ${dueCount} due word${dueCount > 1 ? 's' : ''}` : 'Quick practice'}
              </PrimaryButton>
            </div>
            <ChapterPath progress={progress} onOpen={setOpenChapter} />
          </>
        )}
        {tab === 'listen' && <div className="safe-top"><ListenLab onReview={progress.reviewWord} /></div>}
        {tab === 'write' && <WriteTrainer progress={progress} onWrite={progress.recordWrite} />}
        {tab === 'review' && <ReviewLanding dueCount={dueCount} stats={progress.stats} onStart={startReview} />}
        {tab === 'words' && <WordBrowser progress={progress} />}
      </main>

      <BottomNav active={tab} onChange={setTab} dueCount={dueCount} />

      {/* Overlays — later in DOM = on top */}
      {chapter && (
        <ChapterDetail
          chapter={chapter}
          progress={progress}
          onClose={() => setOpenChapter(null)}
          onPractice={startChapter}
          onOpenGrammar={setOpenGrammar}
        />
      )}
      {openGrammar && (
        <GrammarLesson
          grammar={openGrammar}
          onClose={() => setOpenGrammar(null)}
          onPractice={(g) => { setOpenGrammar(null); startGrammar(g) }}
        />
      )}
      {session && (
        <ExerciseRunner
          queue={session.queue}
          onReview={progress.reviewWord}
          onWrite={progress.recordWrite}
          onGrammar={progress.recordGrammar}
          onClose={() => setSession(null)}
          onComplete={onSessionComplete}
        />
      )}
      {complete && (
        <LessonComplete
          correct={complete.correct}
          total={complete.total}
          xp={complete.xp}
          label={complete.label}
          onContinue={() => setComplete(null)}
        />
      )}
    </div>
  )
}

function ReviewLanding({ dueCount, stats, onStart }) {
  return (
    <div className="px-5 pt-4">
      <h2 className="text-xl font-bold mb-1 mt-2">Review 复习</h2>
      <p className="text-slate-400 text-sm mb-6">Spaced repetition keeps every word fresh — words return right before you'd forget them.</p>
      <div className="rounded-3xl bg-ink-800 border border-white/10 p-6 text-center mb-5">
        <div className="text-6xl font-bold text-gold-400 mb-1">{dueCount}</div>
        <div className="text-slate-400 mb-6">word{dueCount === 1 ? '' : 's'} due for review</div>
        <PrimaryButton color="gold" onClick={onStart}>{dueCount > 0 ? 'Start review' : 'Practice anyway'}</PrimaryButton>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Mastered" value={stats.mastered} color="text-jade-400" />
        <Stat label="Familiar" value={stats.familiar} color="text-sky-300" />
        <Stat label="Learning" value={stats.learning} color="text-gold-400" />
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="rounded-2xl bg-ink-800 border border-white/10 p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  )
}
