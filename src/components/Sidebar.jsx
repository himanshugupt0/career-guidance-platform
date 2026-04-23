import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import api from '../api.js'
import { sidebarNav } from '../data/sidebarNav.js'

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
}

export function Sidebar({ onNavigate }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await api.get('/favorites')
        setUnreadCount(res.data.unreadCount || 0)
      } catch {
        setUnreadCount(0)
      }
    }

    fetchUnread()
  }, [])

  const alertsNav = sidebarNav.find(item => item.to === '/dashboard/alerts')

  return (
    <motion.aside 
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="w-72 shrink-0 border-r border-slate-100/50 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-xl shadow-float dark:border-slate-900/50 dark:bg-gradient-to-b dark:from-slate-950/80 dark:to-slate-900/60 lg:block"
    >
      <div className="p-6 space-y-4">
        <motion.div variants={itemVariants} className="px-2 py-1 text-xs font-black uppercase tracking-widest bg-gradient-text">
          Main Menu
        </motion.div>
        <nav className="grid gap-2">
          {sidebarNav.map((item, index) => {
            const showBadge = item.to === '/dashboard/alerts' && unreadCount > 0
            return (
              <motion.div key={item.to} variants={itemVariants} custom={index}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-4 rounded-2xl px-4 py-4 text-base font-bold transition-all duration-300 backdrop-blur-sm overflow-hidden ripple ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500/30 to-accent-400/30 text-primary-700 shadow-glow-lg ring-2 ring-primary-600/40 dark:from-primary-500/40 dark:to-accent-400/40 dark:text-primary-400'
                        : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-100/50 hover:to-slate-50 hover:text-slate-900 hover:shadow-glow dark:text-slate-300 dark:hover:from-slate-900/50 dark:hover:to-slate-800/50 dark:hover:text-slate-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        size={20} 
                        className={`transition-all duration-300 ${isActive ? 'drop-shadow-glow' : ''}`} 
                      />
                      <span>{item.label}</span>
                      {showBadge && (
                        <motion.span 
                          className="ml-auto absolute -top-2 -right-2 min-w-[20px] h-[20px] bg-red-500 rounded-full text-white text-xs grid place-items-center font-bold shadow-lg border-2 border-white/80"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.span>
                      )}
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-indigo-500/20 -skew-x-12 -rotate-3"
                          layoutId="active"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <motion.div 
                        className="ml-auto h-5 w-1 rounded-full bg-gradient-to-b from-primary-500 to-indigo-600 opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      />
                    </>
                  )}
                </NavLink>
              </motion.div>
            )
          })}
        </nav>
      </div>
    </motion.aside>
  )
}

