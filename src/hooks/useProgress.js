import { useState, useEffect, useCallback, useMemo } from 'react'
import { applyReview, defaultCard, isDue, deriveMastery } from '../lib/sm2'
import { WORDS } from '../data/vocab'

const KEY = 'hsk1-progress-v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function freshState() {
  return {
    cards: {},        // wordId -> sm2 card
    write: {},        // char -> { reps, lastReviewed }
    grammar: {},      // grammarId -> { correct, seen }
    xp: 0,
    streak: 0,
    lastActive: null, // yyyy-mm-dd
    daily: {},        // yyyy-mm-dd -> xp earned that day
    lessonsDone: {},  // lessonId -> highest level cleared
  }
}

export function useProgress() {
  // Merge persisted state over defaults so older saves gain any new keys.
  const [state, setState] = useState(() => ({ ...freshState(), ...(load() || {}) }))

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  }, [state])

  // Roll the streak forward on first load of a new day.
  useEffect(() => {
    setState((s) => {
      const today = todayStr()
      if (s.lastActive === today) return s
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
      let streak = s.streak
      if (s.lastActive && s.lastActive !== yesterday && s.lastActive !== today) streak = 0
      return { ...s, streak }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reviewWord = useCallback((wordId, quality) => {
    setState((s) => {
      const card = s.cards[wordId] || defaultCard()
      const updated = applyReview(card, quality)
      const gain = quality === 0 ? 1 : quality === 1 ? 5 : quality === 2 ? 10 : 12
      const today = todayStr()
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
      let streak = s.streak
      if (s.lastActive !== today) streak = (s.lastActive === yesterday ? streak : 0) + 1
      return {
        ...s,
        cards: { ...s.cards, [wordId]: updated },
        xp: s.xp + gain,
        streak,
        lastActive: today,
        daily: { ...s.daily, [today]: (s.daily[today] || 0) + gain },
      }
    })
  }, [])

  const recordWrite = useCallback((char, mistakes) => {
    setState((s) => {
      const prev = s.write[char] || { reps: 0 }
      const gain = mistakes === 0 ? 10 : mistakes <= 2 ? 6 : 3
      const today = todayStr()
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
      let streak = s.streak
      if (s.lastActive !== today) streak = (s.lastActive === yesterday ? streak : 0) + 1
      return {
        ...s,
        write: { ...s.write, [char]: { reps: prev.reps + 1, lastReviewed: Date.now(), bestMistakes: Math.min(prev.bestMistakes ?? 99, mistakes) } },
        xp: s.xp + gain,
        streak,
        lastActive: today,
        daily: { ...s.daily, [today]: (s.daily[today] || 0) + gain },
      }
    })
  }, [])

  const recordGrammar = useCallback((grammarId, correct) => {
    setState((s) => {
      const prev = s.grammar[grammarId] || { correct: 0, seen: 0 }
      const gain = correct ? 8 : 2
      const today = todayStr()
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
      let streak = s.streak
      if (s.lastActive !== today) streak = (s.lastActive === yesterday ? streak : 0) + 1
      return {
        ...s,
        grammar: { ...s.grammar, [grammarId]: { correct: prev.correct + (correct ? 1 : 0), seen: prev.seen + 1 } },
        xp: s.xp + gain,
        streak,
        lastActive: today,
        daily: { ...s.daily, [today]: (s.daily[today] || 0) + gain },
      }
    })
  }, [])

  const completeLesson = useCallback((lessonId, level) => {
    setState((s) => ({
      ...s,
      lessonsDone: { ...s.lessonsDone, [lessonId]: Math.max(s.lessonsDone[lessonId] || 0, level) },
    }))
  }, [])

  const resetAll = useCallback(() => setState(freshState()), [])

  const stats = useMemo(() => {
    const now = Date.now()
    let mastered = 0, familiar = 0, learning = 0, due = 0
    for (const w of WORDS) {
      const card = state.cards[w.id]
      const m = deriveMastery(card || defaultCard())
      if (m === 'mastered') mastered++
      else if (m === 'familiar') familiar++
      else if (m === 'learning') learning++
      if (card && isDue(card, now)) due++
    }
    const seen = Object.keys(state.cards).length
    const writeChars = Object.keys(state.write).length
    return { mastered, familiar, learning, due, seen, total: WORDS.length, writeChars }
  }, [state])

  const dueWords = useCallback(() => {
    const now = Date.now()
    return WORDS.filter((w) => {
      const c = state.cards[w.id]
      return c && isDue(c, now)
    })
  }, [state])

  return { state, stats, reviewWord, recordWrite, recordGrammar, completeLesson, resetAll, dueWords, cardFor: (id) => state.cards[id], grammarFor: (id) => state.grammar[id] }
}
