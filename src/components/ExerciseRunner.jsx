import { useState, useEffect, useRef, useCallback } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import { useSounds } from '../hooks/useSounds'
import { QUALITY } from '../lib/sm2'
import { Annotated, SpeakerButton, Choice, PrimaryButton, PinyinToggle } from './ui/common'
import { useSettings } from '../hooks/useSettings'
import BuildSentence from './exercises/BuildSentence'
import FillBlank from './exercises/FillBlank'
import GrammarTip from './exercises/GrammarTip'
import CharWriter from './exercises/CharWriter'

export default function ExerciseRunner({ queue, title, onReview, onWrite, onGrammar, onClose, onComplete }) {
  const { speak, speaking } = useSpeech()
  const { showPinyin } = useSettings()
  const sounds = useSounds()
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)   // index of chosen option
  const [revealed, setRevealed] = useState(false)
  const [reAsk, setReAsk] = useState([])        // wrong items to repeat at the end
  const correctRef = useRef(0)                  // scored answers correct
  const scoredRef = useRef(0)                   // scored answers total (excludes tips)
  const autoplayed = useRef(-1)

  const ex = queue[idx]
  const total = queue.length

  // Auto-play audio for listening exercises and grammar tips.
  useEffect(() => {
    if (!ex || autoplayed.current === idx) return
    if (ex.type === 'listen-meaning' || ex.type === 'listen-hanzi') {
      autoplayed.current = idx
      const t = setTimeout(() => speak(ex.audio, { rate: 0.8 }), 350)
      return () => clearTimeout(t)
    }
    if (ex.type === 'grammar-tip' && ex.sentence) {
      autoplayed.current = idx
      const t = setTimeout(() => speak(ex.sentence.hanzi), 400)
      return () => clearTimeout(t)
    }
  }, [idx, ex, speak])

  const record = (correct) => { scoredRef.current += 1; if (correct) correctRef.current += 1 }

  // Advance to the next item (re-asking missed items once at the end).
  const goNext = useCallback(() => {
    setPicked(null); setRevealed(false)
    if (idx + 1 < queue.length) {
      setIdx(idx + 1)
    } else if (reAsk.length) {
      const next = reAsk
      setReAsk([])
      queue.push(...next)
      setIdx(idx + 1)
    } else {
      onComplete?.({ correct: correctRef.current, total: scoredRef.current })
    }
  }, [idx, queue, reAsk, onComplete])

  if (!ex) return null

  const handleChoice = (i) => {
    if (revealed) return
    // Tapping a hanzi option plays its pronunciation.
    if (ex.options[i].han) speak(ex.options[i].label, { rate: 0.8 })
    setPicked(i)
    setRevealed(true)
    const ok = ex.options[i].correct
    record(ok)
    if (ok) { sounds.correct(); onReview?.(ex.word.id, QUALITY.GOOD) }
    else {
      sounds.wrong(); onReview?.(ex.word.id, QUALITY.AGAIN)
      setReAsk((r) => [...r, { ...ex }])
    }
    // speak the word after answering reading/meaning exercises for reinforcement
    if (ex.type !== 'listen-meaning' && ex.type !== 'listen-hanzi') {
      setTimeout(() => speak(ex.word.hanzi, { rate: 0.8 }), 250)
    }
  }

  // Attribute a free-form (sentence/grammar) result to SRS and/or grammar progress.
  const freeResult = (ok) => {
    if (ok) sounds.correct(); else sounds.wrong()
    record(ok)
    if (ex.word) onReview?.(ex.word.id, ok ? QUALITY.GOOD : QUALITY.AGAIN)
    if (ex.grammarId) onGrammar?.(ex.grammarId, ok)
    if (!ok) setReAsk((r) => [...r, { ...ex }])
    goNext()
  }

  const writeResult = (mistakes) => {
    sounds.complete()
    record(mistakes === 0)
    onWrite?.(ex.word.hanzi[0], mistakes)
    onReview?.(ex.word.id, mistakes === 0 ? QUALITY.GOOD : QUALITY.HARD)
    setTimeout(() => goNext(), 600)
  }

  const isChoice = ['listen-meaning', 'listen-hanzi', 'read-meaning', 'meaning-hanzi', 'pinyin-choose'].includes(ex.type)
  const wasCorrect = revealed && picked != null && ex.options?.[picked]?.correct

  return (
    <div className="fixed inset-0 z-40 bg-ink-900 flex flex-col safe-top">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={onClose} className="text-slate-400 text-2xl leading-none px-2">✕</button>
        <div className="flex-1 h-3 rounded-full bg-ink-700 overflow-hidden">
          <div className="h-full bg-jade-500 transition-all" style={{ width: `${(idx / total) * 100}%` }} />
        </div>
        <PinyinToggle />
        <span className="text-xs text-slate-400 w-10 text-right">{idx + 1}/{total}</span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-40">
        <div className="max-w-md mx-auto">
          {ex.prompt && <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-5">{ex.prompt}</h2>}

          {ex.type === 'grammar-tip' ? (
            <GrammarTip key={idx} grammar={ex.grammar} sentence={ex.sentence} speak={speak} speaking={speaking} onContinue={goNext} />
          ) : ex.type === 'build-sentence' ? (
            <BuildSentence key={idx} sentence={ex.sentence} word={ex.word} speak={speak} speaking={speaking} onResult={freeResult} />
          ) : ex.type === 'fill-blank' ? (
            <FillBlank key={idx} exercise={ex} speak={speak} speaking={speaking} onResult={freeResult} />
          ) : ex.type === 'write' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-center text-slate-300">
                <span className="text-lg">{ex.word.en}</span>
                {showPinyin && <><span className="mx-2 text-slate-500">·</span><span className="tone1">{ex.word.pinyin}</span></>}
              </div>
              <CharWriter key={idx} char={ex.word.hanzi[0]} onComplete={writeResult} />
            </div>
          ) : (
            <>
              {/* Stimulus */}
              {(ex.type === 'listen-meaning' || ex.type === 'listen-hanzi') ? (
                <div className="flex justify-center mb-8">
                  <SpeakerButton onClick={() => speak(ex.audio, { rate: 0.8 })} speaking={speaking} size="w-24 h-24" big />
                </div>
              ) : (
                <div className="mb-8 flex flex-col items-center gap-3">
                  {ex.type === 'pinyin-choose'
                    ? <div className="han text-6xl">{ex.word.hanzi}</div>
                    : <Annotated text={ex.word.hanzi} size="text-6xl" pinyinSize="text-base" showPinyin={ex.type === 'meaning-hanzi' ? false : false} />}
                  {ex.type !== 'meaning-hanzi' && (
                    <SpeakerButton onClick={() => speak(ex.word.hanzi, { rate: 0.8 })} speaking={speaking} />
                  )}
                </div>
              )}

              {/* Options */}
              <div className="flex flex-col gap-3">
                {ex.options.map((o, i) => {
                  let state = 'idle'
                  if (revealed) {
                    if (o.correct) state = 'correct'
                    else if (i === picked) state = 'wrong'
                    else state = 'muted'
                  }
                  return (
                    <Choice key={i} state={state} disabled={revealed} onClick={() => handleChoice(i)}>
                      <span className={o.han ? 'han text-2xl' : ''}>{o.label}</span>
                    </Choice>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Feedback footer for choice exercises */}
      {isChoice && revealed && (
        <div className={`fixed bottom-0 inset-x-0 safe-bottom animate-slideup ${wasCorrect ? 'bg-jade-600/20' : 'bg-cinnabar-600/20'} border-t ${wasCorrect ? 'border-jade-500/40' : 'border-cinnabar-500/40'}`}>
          <div className="max-w-md mx-auto px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className={`font-bold text-lg ${wasCorrect ? 'text-jade-400' : 'text-cinnabar-400'}`}>
                  {wasCorrect ? '正确 · Correct!' : '再试一次 · Not quite'}
                </p>
                <p className="text-sm text-slate-300 mt-0.5">
                  <span className="han text-base">{ex.word.hanzi}</span>
                  {showPinyin && <span className="mx-1.5 tone1">{ex.word.pinyin}</span>}
                  <span className="text-slate-400">{showPinyin ? '— ' : ' '}{ex.word.en}</span>
                </p>
              </div>
              <SpeakerButton onClick={() => speak(ex.word.hanzi, { rate: 0.8 })} speaking={speaking} />
            </div>
            <PrimaryButton color={wasCorrect ? 'jade' : 'cinnabar'} onClick={goNext}>
              Continue
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  )
}
