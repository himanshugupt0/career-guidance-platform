import { Link } from 'react-router-dom'
import { Logo } from './Logo.jsx'
import { DarkModeToggle } from './DarkModeToggle.jsx'

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-page py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>
          <DarkModeToggle compact />
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <div className="card p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {subtitle}
              </p>
            ) : null}

            <div className="mt-6">{children}</div>
          </div>

          {footer ? (
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

