import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Global, persisted UI settings. Currently just the pinyin-visibility toggle,
// which governs whether pinyin annotations appear on Chinese words & sentences
// throughout the app (exercises, vocab lists, grammar examples, etc.).
const KEY = 'hsk1-settings-v1'

const SettingsContext = createContext({ showPinyin: true, setShowPinyin: () => {}, toggle: () => {} })

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function SettingsProvider({ children }) {
  const [showPinyin, setShowPinyin] = useState(() => load()?.showPinyin ?? true)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ showPinyin })) } catch {}
  }, [showPinyin])

  const toggle = useCallback(() => setShowPinyin((v) => !v), [])

  return (
    <SettingsContext.Provider value={{ showPinyin, setShowPinyin, toggle }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
