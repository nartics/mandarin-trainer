import { useState, useCallback, useRef } from 'react'
import { useProgress } from './hooks/useProgress'
import { lessonWords, WORDS, LESSONS } from './data/vocab'
import { buildQueue, shuffle } from './lib/queue'
import { isDue } from './lib/sm2'
import Dashboard from './components/Dashboard'
import LessonPath from './components/LessonPath'
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
  const [session, setSession] = useState(null) // { queue, title, label }
  const [complete, setComplete] = useState(null)
  const xpAtStart = useRef(0)

  const dueCount = WORDS.filter((w) => { const c = progress.cardFor(w.id); return c && isDue(c) }).length

  const startSession = useCallback((queue, title, label) => {
    if (!queue.length) return
    xpAtStart.current = progress.state.xp
    setSession({ queue, title, label })
  }, [progress.state.xp])

  const startLesson = useCallback((lessonId) => {
    const words = lessonWords(lessonId)
    const queue = buildQueue(words, { includeWrite: true, perWord: 1 })
    // add a couple of build-sentence + write reps for depth
    startSession(queue, LESSONS.find((l) => l.id === lessonId)?.title, 'Lesson complete!')
  }, [startSession])

  const startReview = useCallback(() => {
    let pool = progress.dueWords()
    if (pool.length < 6) {
      // top up with seen-but-weakest, then new words
      const seen = WORDS.filter((w) => progress.cardFor(w.id))
        .sort((a, b) => (progress.cardFor(a.id)?.interval ?? 0) - (progress.cardFor(b.id)?.interval ?? 0))
      const fresh = WORDS.filter((w) => !progress.cardFor(w.id))
      const extra = [...seen, ...fresh].filter((w) => !pool.includes(w)).slice(0, 12 - pool.length)
      pool = [...pool, ...extra]
    }
    pool = shuffle(pool).slice(0, 14)
    const queue = buildQueue(pool, { includeWrite: false, perWord: 1 })
    startSession(queue, 'Review', 'Review complete!')
  }, [progress, startSession])

  const onSessionComplete = useCallback((res) => {
    const xpEarned = progress.state.xp - xpAtStart.current
    setComplete({ ...res, xp: xpEarned, label: session?.label })
    setSession(null)
  }, [progress.state.xp, session])

  return (
    <div className="min-h-full max-w-md mx-auto relative">
      {/* Main tabs */}
      <main className="pb-24 safe-top">
        {tab === 'learn' && (
          <>
            <Dashboard stats={progress.stats} streak={progress.state.streak} xp={progress.state.xp} />
            <div className="px-5 mb-2">
              <PrimaryButton color="gold" onClick={startReview}>
                {dueCount > 0 ? `Review ${dueCount} due word${dueCount > 1 ? 's' : ''}` : 'Quick practice'}
              </PrimaryButton>
            </div>
            <LessonPath progress={progress} onStart={startLesson} />
          </>
        )}
        {tab === 'listen' && <div className="safe-top"><ListenLab onReview={progress.reviewWord} /></div>}
        {tab === 'write' && <WriteTrainer progress={progress} onWrite={progress.recordWrite} />}
        {tab === 'review' && (
          <ReviewLanding dueCount={dueCount} stats={progress.stats} onStart={startReview} />
        )}
        {tab === 'words' && <WordBrowser progress={progress} />}
      </main>

      <BottomNav active={tab} onChange={setTab} dueCount={dueCount} />

      {/* Overlays */}
      {session && (
        <ExerciseRunner
          queue={session.queue}
          title={session.title}
          onReview={progress.reviewWord}
          onWrite={progress.recordWrite}
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
      <p className="text-slate-400 text-sm mb-6">Spaced repetition keeps every word fresh. Words come back right before you'd forget them.</p>
      <div className="rounded-3xl bg-ink-800 border border-white/10 p-6 text-center mb-5">
        <div className="text-6xl font-bold text-gold-400 mb-1">{dueCount}</div>
        <div className="text-slate-400 mb-6">word{dueCount === 1 ? '' : 's'} due for review</div>
        <PrimaryButton color="gold" onClick={onStart}>
          {dueCount > 0 ? 'Start review' : 'Practice anyway'}
        </PrimaryButton>
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
