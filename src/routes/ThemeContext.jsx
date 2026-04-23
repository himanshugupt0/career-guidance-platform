/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadTheme, saveTheme } from './storage.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(loadTheme)

  useEffect(() => {
    const root = document.documentElement
    root.style.transition = 'all 0.3s ease'
    if (mode === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    saveTheme(mode)
  }, [mode])

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      setMode,
    }),
    [mode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

