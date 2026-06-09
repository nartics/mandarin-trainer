// Lightweight SM-2 spaced repetition. Quality: 0=Again 1=Hard 2=Good 3=Easy.
export const QUALITY = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 }
const MIN_EASE = 1.3
const MAX_EASE = 2.8
const DAY = 86_400_000
const TEN_MIN = 10 * 60 * 1000

export function defaultCard() {
  return { ease: 2.3, interval: 0, reps: 0, dueAt: 0, lapses: 0 }
}

const clamp = (e) => Math.max(MIN_EASE, Math.min(MAX_EASE, e))

export function applyReview(card, quality, now = Date.now()) {
  const c = { ...defaultCard(), ...card }
  let { ease, interval, reps, lapses } = c
  let due

  switch (quality) {
    case QUALITY.AGAIN:
      ease = clamp(ease - 0.2); interval = 0; reps = 0; lapses += 1
      due = now + TEN_MIN; break
    case QUALITY.HARD:
      ease = clamp(ease - 0.15); interval = Math.max(Math.round(interval * 1.2), 1); reps += 1
      due = now + interval * DAY; break
    case QUALITY.GOOD:
      if (reps === 0) interval = 1
      else if (reps === 1) interval = 3
      else if (reps === 2) interval = 7
      else interval = Math.round(interval * ease)
      reps += 1; due = now + interval * DAY; break
    case QUALITY.EASY:
      ease = clamp(ease + 0.15)
      if (reps === 0) interval = 3
      else if (reps === 1) interval = 7
      else interval = Math.round(interval * ease * 1.3)
      reps += 1; due = now + interval * DAY; break
    default: return card
  }
  return { ease, interval, reps, lapses, dueAt: due, lastReviewed: now }
}

export function isDue(card, now = Date.now()) {
  if (!card || !card.dueAt) return true
  return card.dueAt <= now
}

export function deriveMastery(card) {
  const i = card?.interval ?? 0
  if (!card || card.reps === 0) return 'new'
  if (i < 7) return 'learning'
  if (i < 30) return 'familiar'
  return 'mastered'
}
