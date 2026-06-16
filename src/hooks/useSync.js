import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, hasSupabase } from '../lib/supabase'

// Shares the spanish-trainer Supabase project (one login across apps) but stores
// this app's progress in its own table so the two never collide.
const TABLE = 'mandarin_progress'
const PROGRESS_KEY = 'hsk1-progress-v1'
const LAST_SYNC_KEY = 'hsk1-last-sync'
const RELOAD_EVENT = 'hsk1-sync-reload'

const max = (a, b) => Math.max(a || 0, b || 0)
const keys = (...objs) => new Set(objs.flatMap((o) => Object.keys(o || {})))

// Merge two progress snapshots, always keeping the most progress on each field.
function mergeProgress(local, remote) {
  if (!remote || typeof remote !== 'object') return local
  if (!local || typeof local !== 'object') return remote
  const m = { ...local }

  // SRS cards: keep whichever is further along (more reps, then longer interval,
  // then more recently reviewed).
  m.cards = {}
  for (const id of keys(local.cards, remote.cards)) {
    const l = local.cards?.[id], r = remote.cards?.[id]
    if (!l) { m.cards[id] = r; continue }
    if (!r) { m.cards[id] = l; continue }
    const score = (c) => [c.reps || 0, c.interval || 0, c.lastReviewed || 0]
    const [lr, li, lt] = score(l), [rr, ri, rt] = score(r)
    m.cards[id] = (lr > rr || (lr === rr && (li > ri || (li === ri && lt >= rt)))) ? l : r
  }

  // Writing practice: more reps + fewest mistakes.
  m.write = {}
  for (const ch of keys(local.write, remote.write)) {
    const l = local.write?.[ch] || {}, r = remote.write?.[ch] || {}
    m.write[ch] = {
      reps: max(l.reps, r.reps),
      lastReviewed: Math.max(l.lastReviewed || 0, r.lastReviewed || 0),
      bestMistakes: Math.min(l.bestMistakes ?? 99, r.bestMistakes ?? 99),
    }
  }

  // Grammar: union of seen/correct counts, introduced if either.
  m.grammar = {}
  for (const id of keys(local.grammar, remote.grammar)) {
    const l = local.grammar?.[id] || {}, r = remote.grammar?.[id] || {}
    m.grammar[id] = { correct: max(l.correct, r.correct), seen: max(l.seen, r.seen), introduced: !!(l.introduced || r.introduced) }
  }

  m.xp = max(local.xp, remote.xp)
  m.streak = max(local.streak, remote.streak)
  m.lastActive = (local.lastActive || '') > (remote.lastActive || '') ? local.lastActive : remote.lastActive

  m.daily = {}
  for (const d of keys(local.daily, remote.daily)) m.daily[d] = max(local.daily?.[d], remote.daily?.[d])

  m.lessonsDone = {}
  for (const id of keys(local.lessonsDone, remote.lessonsDone)) m.lessonsDone[id] = max(local.lessonsDone?.[id], remote.lessonsDone?.[id])

  return m
}

function readLocal() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} }
}
function writeLocal(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
    window.dispatchEvent(new Event(RELOAD_EVENT)) // tell useProgress to reload
  } catch {}
}

export function useSync() {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('idle') // idle | syncing | synced | error
  const pushTimer = useRef(null)

  const pull = useCallback(async (userId) => {
    if (!hasSupabase() || !userId) return
    setStatus('syncing')
    try {
      const { data, error } = await supabase.from(TABLE).select('progress').eq('user_id', userId).single()
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no row yet
      if (data?.progress) writeLocal(mergeProgress(readLocal(), data.progress))
      setStatus('synced')
    } catch { setStatus('error') }
  }, [])

  const pushFor = useCallback(async (userId) => {
    if (!hasSupabase() || !userId) return
    setStatus('syncing')
    try {
      await supabase.from(TABLE).upsert({ user_id: userId, progress: readLocal(), updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
      setStatus('synced')
    } catch { setStatus('error') }
  }, [])

  // Restore session + react to auth changes.
  useEffect(() => {
    if (!hasSupabase()) return
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) pull(u.id)
    })
    return () => subscription.unsubscribe()
  }, [pull])

  // Re-pull when the tab regains focus (pick up progress from other devices).
  useEffect(() => {
    if (!user) return
    const onFocus = () => pull(user.id)
    const onVisible = () => document.visibilityState === 'visible' && pull(user.id)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    return () => { window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onVisible) }
  }, [user, pull])

  const schedulePush = useCallback((delay = 4000) => {
    if (!user) return
    clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(() => pushFor(user.id), delay)
  }, [user, pushFor])

  const signIn = useCallback(async (email) => {
    if (!hasSupabase()) return { error: 'Sync not configured' }
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    return error ? { error: error.message } : { sent: true }
  }, [])

  const verifyOtp = useCallback(async (email, token) => {
    if (!hasSupabase()) return { error: 'Sync not configured' }
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    return error ? { error: error.message } : { verified: true }
  }, [])

  const signOut = useCallback(async () => {
    if (!hasSupabase()) return
    await supabase.auth.signOut()
    setUser(null); setStatus('idle')
    localStorage.removeItem(LAST_SYNC_KEY)
  }, [])

  // Authoritative reset: clear local + overwrite the cloud row with empty progress
  // (not a merge), and cancel any pending push, so a later pull can't restore it.
  const reset = useCallback(async () => {
    clearTimeout(pushTimer.current)
    try {
      localStorage.removeItem(PROGRESS_KEY)
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
    } catch {}
    window.dispatchEvent(new Event(RELOAD_EVENT))
    if (hasSupabase() && user) {
      setStatus('syncing')
      try {
        await supabase.from(TABLE).upsert({ user_id: user.id, progress: {}, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        setStatus('synced')
      } catch { setStatus('error') }
    }
  }, [user])

  return {
    configured: hasSupabase(),
    user, status, signIn, verifyOtp, signOut, reset,
    push: () => user && pushFor(user.id),
    pull: () => user && pull(user.id),
    schedulePush,
    lastSync: () => localStorage.getItem(LAST_SYNC_KEY),
  }
}
