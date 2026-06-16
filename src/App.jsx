import { useState, useCallback, useRef, useEffect } from 'react'
import { useProgress } from './hooks/useProgress'
import { useSync } from './hooks/useSync'
import AccountPanel from './components/AccountPanel'
import { WORDS } from './data/vocab'
import { CHAPTER_BY_NUM, CURRENT_CHAPTER, activeChapterNum } from './data/chapters'
import { GRAMMAR, GRAMMAR_BY_ID } from './data/grammar'
import { buildQueue, buildChapterQueue, buildGrammarQueue, buildReviewQueue, shuffle } from './lib/queue'
import { isDue } from './lib/sm2'
import Dashboard from './components/Dashboard'
import ChapterDetail from './components/ChapterDetail'
import GrammarLesson from './components/GrammarLesson'
import BottomNav from './components/BottomNav'
import ExerciseRunner from './components/ExerciseRunner'
import LessonComplete from './components/LessonComplete'
import WriteTrainer from './components/WriteTrainer'
import ListenLab from './components/ListenLab'
import WordBrowser from './components/WordBrowser'
import { PrimaryButton } from './components/ui/common'
import Sidebar from './components/duo/Sidebar'
import RightRail from './components/duo/RightRail'
import PathView from './components/duo/PathView'

export default function App() {
  const progress = useProgress()
  const sync = useSync()
  const [tab, setTab] = useState('learn')
  const [openChapter, setOpenChapter] = useState(null) // chapter num
  const [openGrammar, setOpenGrammar] = useState(null) // grammar obj
  const [session, setSession] = useState(null)         // { queue, label }
  const [complete, setComplete] = useState(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const xpAtStart = useRef(0)

  const activeChapter = CHAPTER_BY_NUM[activeChapterNum(progress)]

  // Push local progress to the cloud (debounced) whenever it changes.
  useEffect(() => { sync.schedulePush() }, [progress.state, sync.schedulePush])

  const dueCount = WORDS.filter((w) => { const c = progress.cardFor(w.id); return c && isDue(c) }).length

  const start = useCallback((queue, label) => {
    if (!queue.length) return
    xpAtStart.current = progress.state.xp
    setSession({ queue, label })
  }, [progress.state.xp])

  const startChapter = useCallback((chapter) => start(buildChapterQueue(chapter, { isIntroduced: progress.isIntroduced }), `Chapter ${chapter.num} complete!`), [start, progress.isIntroduced])
  const startGrammar = useCallback((grammar) => start(buildGrammarQueue(grammar), 'Grammar practiced!'), [start])

  const startReview = useCallback(() => {
    let pool = progress.dueWords()
    if (pool.length < 6) {
      const seen = WORDS.filter((w) => progress.cardFor(w.id))
        .sort((a, b) => (progress.cardFor(a.id)?.interval ?? 0) - (progress.cardFor(b.id)?.interval ?? 0))
      const fresh = WORDS.filter((w) => !progress.cardFor(w.id))
      pool = [...pool, ...[...seen, ...fresh].filter((w) => !pool.includes(w)).slice(0, 12 - pool.length)]
    }
    // Weave in 2-3 grammar beats from chapters reached so far, least-practiced first.
    const grammarPicks = GRAMMAR
      .filter((g) => g.chapter <= CURRENT_CHAPTER)
      .sort((a, b) => (progress.grammarFor(a.id)?.seen ?? 0) - (progress.grammarFor(b.id)?.seen ?? 0))
      .slice(0, 3)
    start(buildReviewQueue(shuffle(pool).slice(0, 12), grammarPicks, { isIntroduced: progress.isIntroduced }), 'Review complete!')
  }, [progress, start])

  // Reset all progress to zero — locally and authoritatively in the cloud, so the
  // merge-on-pull can't restore it.
  const resetProgress = useCallback(() => {
    progress.resetAll()
    sync.reset()
    setSession(null); setComplete(null); setOpenChapter(null); setOpenGrammar(null)
  }, [progress, sync])

  const onSessionComplete = useCallback((res) => {
    setComplete({ ...res, xp: progress.state.xp - xpAtStart.current, label: session?.label })
    setSession(null)
  }, [progress.state.xp, session])

  const chapter = openChapter != null ? CHAPTER_BY_NUM[openChapter] : null

  return (
    <div className="min-h-full">
      <div className="lg:flex lg:max-w-[1280px] lg:mx-auto">
        <Sidebar tab={tab} onChange={setTab} dueCount={dueCount} onOpenAccount={() => setAccountOpen(true)} syncStatus={sync.status} signedIn={!!sync.user} className="hidden lg:flex sticky top-0 h-screen" />

        <main className="flex-1 min-w-0 pb-24 lg:pb-12 safe-top lg:pt-8">
          {tab === 'learn' && (
            <>
              {/* Mobile-only minimal top bar */}
              <div className="lg:hidden">
                <Dashboard onOpenAccount={() => setAccountOpen(true)} signedIn={!!sync.user} />
              </div>
              <PathView progress={progress} onOpenChapter={setOpenChapter} onOpenGrammar={setOpenGrammar} onPractice={startChapter} />
            </>
          )}
          {tab !== 'learn' && (
            <div className="lg:max-w-[640px] lg:mx-auto">
              {tab === 'listen' && <ListenLab onReview={progress.reviewWord} />}
              {tab === 'write' && <WriteTrainer progress={progress} onWrite={progress.recordWrite} />}
              {tab === 'review' && <ReviewLanding dueCount={dueCount} stats={progress.stats} onStart={startReview} />}
              {tab === 'words' && <WordBrowser progress={progress} />}
            </div>
          )}
        </main>

        <RightRail chapter={activeChapter} onPractice={startChapter} className="hidden xl:block sticky top-0 h-screen overflow-y-auto no-scrollbar" />
      </div>

      <div className="lg:hidden">
        <BottomNav active={tab} onChange={setTab} dueCount={dueCount} />
      </div>

      {/* Overlays — later in DOM = on top */}
      {accountOpen && <AccountPanel sync={sync} onReset={resetProgress} onClose={() => setAccountOpen(false)} />}
      {chapter && (
        <ChapterDetail
          chapter={chapter}
          progress={progress}
          onClose={() => setOpenChapter(null)}
          onPractice={startChapter}
          onOpenGrammar={setOpenGrammar}
        />
      )}
      {session && (
        <ExerciseRunner
          queue={session.queue}
          onReview={progress.reviewWord}
          onWrite={progress.recordWrite}
          onGrammar={progress.recordGrammar}
          onGrammarIntroduced={progress.markGrammarIntroduced}
          onOpenGrammar={(id) => setOpenGrammar(GRAMMAR_BY_ID[id])}
          onClose={() => setSession(null)}
          onComplete={onSessionComplete}
        />
      )}
      {openGrammar && (
        <GrammarLesson
          grammar={openGrammar}
          onClose={() => setOpenGrammar(null)}
          onPractice={(g) => { setOpenGrammar(null); startGrammar(g) }}
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
