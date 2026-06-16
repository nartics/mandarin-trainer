import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Global, persisted UI settings: pinyin visibility (governs pinyin annotations on
// Chinese words & sentences throughout the app) and the daily XP goal.
const KEY = 'hsk1-settings-v1'
const DEFAULT_GOAL = 30

const SettingsContext = createContext({ showPinyin: true, toggle: () => {}, dailyGoal: DEFAULT_GOAL, setDailyGoal: () => {} })

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function SettingsProvider({ children }) {
  const saved = load()
  const [showPinyin, setShowPinyin] = useState(() => saved?.showPinyin ?? true)
  const [dailyGoal, setDailyGoal] = useState(() => saved?.dailyGoal ?? DEFAULT_GOAL)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ showPinyin, dailyGoal })) } catch {}
  }, [showPinyin, dailyGoal])

  const toggle = useCallback(() => setShowPinyin((v) => !v), [])

  return (
    <SettingsContext.Provider value={{ showPinyin, setShowPinyin, toggle, dailyGoal, setDailyGoal }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
