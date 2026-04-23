import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, LogOut, User, ChevronDown, Bell } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle.jsx'
import { useAuth } from '../routes/AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import api from '../api.js'

export function Topbar({ onOpenMenu }) {
  const { user, logout, isAuthed, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!isAuthed) {
      setUnreadCount(0)
      return
    }

    async function fetchUnread() {
      try {
        const res = await api.get('/favorites')
        setUnreadCount(res.data.unreadCount || 0)
      } catch {
        setUnreadCount(0)
      }
    }

    fetchUnread()
  }, [token])

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 bg-gradient-to-r from-slate-50/95 via-white/98 to-primary-50/30 dark:from-slate-950/95 dark:via-slate-950/98 dark:to-primary-950/30 backdrop-blur-xl border-b border-slate-200/30 shadow-glow dark:border-slate-800/30 shadow-lg"
    >
      <div className="container-page flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn-ghost lg:hidden p-2"
            onClick={onOpenMenu}
            aria-label="Open sidebar menu"
          >
            <Menu size={20} />
          </motion.button>
          <div className="hidden sm:block">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold bg-gradient-text text-xl leading-tight"
            >
              Career Dashboard
            </motion.div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Welcome back{user?.name ? `, ${user.name}` : ''} 👋
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle compact />
          
          <motion.div whileTap={{ scale: 0.95 }} className="relative">
            <Link to="/dashboard/alerts" className="btn-ghost p-2 ripple">
              <Bell size={18} className="relative">
                {unreadCount > 0 && (
                  <>
                    <motion.span 
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-xs grid place-items-center font-bold shadow-lg border-2 border-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                    <motion.circle 
                      className="animate-ping absolute -top-1 -right-1 h-[20px] w-[20px] rounded-full bg-red-400 -z-10"
                      animate={{ scale: [1, 1.3, 1] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </>
                )}
                <span className="sr-only">Notifications ({unreadCount || 0})</span>
              </Bell>
            </Link>
          </motion.div>

          <Link to="/" className="btn-ghost hidden lg:inline-flex">
            Home
          </Link>

          {/* Avatar Dropdown */}
          <motion.div 
            className="relative"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500/10 to-indigo-500/10 p-2 text-sm font-bold text-primary-700 backdrop-blur-sm shadow-float hover:shadow-glow dark:from-primary-400/20 dark:to-indigo-400/20 dark:text-primary-300"
            >
              <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 grid place-items-center text-white font-bold text-xs uppercase">
                {user?.name?.[0] || 'U'}
              </div>
              <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-glow-lg py-2 dark:bg-slate-900/95 dark:border-slate-800/50"
                >
                  <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 rounded-xl mx-1">
                    <User size={16} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      navigate('/login')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 rounded-xl mx-1"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

