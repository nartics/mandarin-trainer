// Achievement badges. Each badge is earned when value(ctx) >= threshold.
// ctx = { stats, state, chaptersDone, charsClean, goalDays }
//   stats        — useProgress().stats (mastered/familiar/learning/total…)
//   state        — useProgress().state (xp/streak/bestStreak/grammar/write/daily…)
//   chaptersDone — number of fully-completed chapters
//   charsClean   — characters traced with zero mistakes
//   goalDays     — days the daily XP goal was hit
// Pure data + derivation helpers; no React.

import { chaptersCompletedCount } from './chapters'

// Build the badge-evaluation context from the progress hook + daily goal.
export function buildCtx(progress, dailyGoal = 30) {
  const state = progress.state
  const charsClean = Object.values(state.write || {}).filter((w) => (w.bestMistakes ?? 99) === 0).length
  const goalDays = Object.values(state.daily || {}).filter((xp) => xp >= dailyGoal).length
  return { stats: progress.stats, state, chaptersDone: chaptersCompletedCount(progress), charsClean, goalDays }
}

export const BADGES = [
  // ── Vocabulary ───────────────────────────────────────────────────────────
  { id: 'words-1', group: 'Vocabulary', icon: '🌱', name: 'First steps', desc: 'Learn your first word', threshold: 1, value: (c) => c.stats.mastered + c.stats.familiar },
  { id: 'words-25', group: 'Vocabulary', icon: '📗', name: 'Getting going', desc: 'Master 25 words', threshold: 25, value: (c) => c.stats.mastered },
  { id: 'words-75', group: 'Vocabulary', icon: '📚', name: 'Word collector', desc: 'Master 75 words', threshold: 75, value: (c) => c.stats.mastered },
  { id: 'words-all', group: 'Vocabulary', icon: '🏆', name: 'HSK 1 vocab', desc: 'Master all 146 words', threshold: 146, value: (c) => c.stats.mastered },

  // ── Grammar ──────────────────────────────────────────────────────────────
  { id: 'gram-1', group: 'Grammar', icon: '💡', name: 'Pattern spotter', desc: 'Practise your first grammar point', threshold: 1, value: (c) => Object.keys(c.state.grammar || {}).length },
  { id: 'gram-12', group: 'Grammar', icon: '🧩', name: 'Pattern pro', desc: 'Practise 12 grammar points', threshold: 12, value: (c) => Object.keys(c.state.grammar || {}).length },
  { id: 'gram-all', group: 'Grammar', icon: '🎓', name: 'Grammarian', desc: 'See all 23 grammar points', threshold: 23, value: (c) => Object.keys(c.state.grammar || {}).length },

  // ── Chapters ─────────────────────────────────────────────────────────────
  { id: 'chap-1', group: 'Chapters', icon: '✅', name: 'Chapter one', desc: 'Complete chapter 1', threshold: 1, value: (c) => c.chaptersDone },
  { id: 'chap-5', group: 'Chapters', icon: '🚩', name: 'Five down', desc: 'Complete 5 chapters', threshold: 5, value: (c) => c.chaptersDone },
  { id: 'chap-all', group: 'Chapters', icon: '👑', name: 'Course complete', desc: 'Complete all 15 chapters', threshold: 15, value: (c) => c.chaptersDone },

  // ── Streak ───────────────────────────────────────────────────────────────
  { id: 'streak-3', group: 'Streak', icon: '🔥', name: 'On a roll', desc: '3-day streak', threshold: 3, value: (c) => Math.max(c.state.streak || 0, c.state.bestStreak || 0) },
  { id: 'streak-7', group: 'Streak', icon: '🔥', name: 'Week strong', desc: '7-day streak', threshold: 7, value: (c) => Math.max(c.state.streak || 0, c.state.bestStreak || 0) },
  { id: 'streak-30', group: 'Streak', icon: '🔥', name: 'Unstoppable', desc: '30-day streak', threshold: 30, value: (c) => Math.max(c.state.streak || 0, c.state.bestStreak || 0) },

  // ── Writing ──────────────────────────────────────────────────────────────
  { id: 'write-1', group: 'Writing', icon: '🖌️', name: 'First stroke', desc: 'Trace a character perfectly', threshold: 1, value: (c) => c.charsClean },
  { id: 'write-50', group: 'Writing', icon: '✍️', name: 'Calligrapher', desc: 'Trace 50 characters perfectly', threshold: 50, value: (c) => c.charsClean },

  // ── Dedication ───────────────────────────────────────────────────────────
  { id: 'goal-1', group: 'Dedication', icon: '⭐', name: 'Daily goal', desc: 'Hit your daily goal', threshold: 1, value: (c) => c.goalDays },
  { id: 'goal-7', group: 'Dedication', icon: '🌟', name: 'Goal week', desc: 'Hit your daily goal 7 days', threshold: 7, value: (c) => c.goalDays },
]

export const BADGE_GROUPS = ['Vocabulary', 'Grammar', 'Chapters', 'Streak', 'Writing', 'Dedication']
export const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b]))

export function isEarned(badge, ctx) {
  return badge.value(ctx) >= badge.threshold
}

export function earnedIds(ctx) {
  return BADGES.filter((b) => isEarned(b, ctx)).map((b) => b.id)
}

// { current, threshold, pct } for a (locked) badge's progress display.
export function progressFor(badge, ctx) {
  const current = Math.min(badge.value(ctx), badge.threshold)
  return { current, threshold: badge.threshold, pct: Math.round((current / badge.threshold) * 100) }
}
