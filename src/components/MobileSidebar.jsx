import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { Logo } from './Logo.jsx'
import { sidebarNav } from '../data/sidebarNav.js'

export function MobileSidebar({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/40"
        onClick={onClose}
        aria-label="Close sidebar"
      />
      <div className="absolute left-0 top-0 h-full w-[82%] max-w-sm border-r border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-2">
          <Logo />
          <button type="button" className="btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-2">
          <div className="px-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Menu
          </div>
          <nav className="grid gap-1">
            {sidebarNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

