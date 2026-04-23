import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../routes/ThemeContext.jsx'

export function DarkModeToggle({ compact = false }) {
  const { isDark, toggle } = useTheme()
  const label = isDark ? 'Dark' : 'Light'

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900 ${
        compact ? 'px-2' : ''
      }`}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
      {!compact && <span>{label} mode</span>}
    </button>
  )
}

