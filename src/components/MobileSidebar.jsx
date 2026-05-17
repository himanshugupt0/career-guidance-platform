import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { Logo } from './Logo.jsx'
import { sidebarNav } from '../data/sidebarNav.js'
import { motion, AnimatePresence } from 'framer-motion'

export function MobileSidebar({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-0 top-0 h-full w-[80%] max-w-xs bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-800">
              <Logo />
              <button
                type="button"
                className="btn-ghost p-2"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="mb-2 px-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
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
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300 shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                      }`
                    }
                  >
                    <item.icon size={18} className="shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
