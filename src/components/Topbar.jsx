import { Link, useNavigate } from 'react-router-dom'
import { Menu, LogOut, User, ChevronDown, Bell } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle.jsx'
import { useAuth } from '../routes/AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import api from '../api.js'

export function Topbar({ onOpenMenu }) {
  const { user, logout, isAuthed, token } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!isAuthed) { setUnreadCount(0); return }
    api.get('/favorites').then(res => setUnreadCount(res.data.unreadCount || 0)).catch(() => setUnreadCount(0))
  }, [token, isAuthed])

  return (
    <motion.div
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm"
    >
      <div className="flex h-14 sm:h-16 items-center justify-between gap-2 px-3 sm:px-5 lg:px-8 max-w-7xl mx-auto">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            className="btn-ghost lg:hidden p-2 shrink-0"
            onClick={onOpenMenu}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <div className="font-bold bg-gradient-text text-base sm:text-lg leading-tight truncate">
              Career Dashboard
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              Welcome back{user?.name ? `, ${user.name}` : ''} 👋
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <DarkModeToggle compact />

          {/* Bell */}
          <Link to="/dashboard/alerts" className="btn-ghost p-2 relative">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-red-500 text-white text-[10px] grid place-items-center font-bold border border-white dark:border-slate-950">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            <span className="sr-only">Alerts</span>
          </Link>

          <Link to="/" className="btn-ghost hidden lg:inline-flex text-sm">Home</Link>

          {/* Avatar dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <button className="flex items-center gap-1.5 rounded-2xl bg-primary-500/10 dark:bg-primary-400/20 px-2 py-1.5 text-sm font-bold text-primary-700 dark:text-primary-300 hover:bg-primary-500/20 transition-all">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 grid place-items-center text-white font-bold text-xs uppercase shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <span className="hidden sm:block max-w-[80px] truncate text-xs">{user?.name || 'User'}</span>
              <ChevronDown size={14} className={`transition-transform shrink-0 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl py-1.5 z-50"
                >
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl mx-1"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={15} /> Profile
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/login') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl mx-1"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
