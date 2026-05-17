import { Link } from 'react-router-dom'
import { Logo } from './Logo.jsx'
import { DarkModeToggle } from './DarkModeToggle.jsx'

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto w-full">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>
        <DarkModeToggle compact />
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="card p-5 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
            )}
            <div className="mt-5 sm:mt-6">{children}</div>
          </div>

          {footer && (
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
