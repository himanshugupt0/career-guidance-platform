import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useScroll } from 'framer-motion'
import { LogIn, LogOut, UserPlus } from 'lucide-react'
import { Logo } from './Logo.jsx'
import { DarkModeToggle } from './DarkModeToggle.jsx'
import { useAuth } from '../routes/AuthContext.jsx'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function NavItem({ to, children }) {
  return (
    <button
      onClick={() => {
        document.querySelector(to)?.scrollIntoView({ behavior: 'smooth' })
      }}
      className="rounded-2xl px-4 py-2.5 text-sm font-bold transition-all backdrop-blur-sm cursor-pointer hover:bg-slate-100/50 hover:shadow-float dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-200"
    >
      {children}
    </button>
  )
}

export function Navbar({ variant = 'marketing' }) {
  const { isAuthed, logout } = useAuth()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const [isShrunk, setIsShrunk] = useState(false)

  // Scroll shrink effect
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsShrunk(latest > 50)
    })
  }, [scrollY])

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 backdrop-blur-2xl transition-all duration-500 border-b shadow-float/50 ${
        isShrunk 
          ? 'h-16 shadow-glow-lg border-[var(--border)]/50 bg-[var(--bg-card)]/95 dark:border-[var(--border)]/50 dark:bg-[var(--bg-primary)]/95' 
          : 'h-24 border-[var(--border)]/30 bg-gradient-to-b from-[var(--bg-primary)]/98 via-primary-50/30 to-[var(--bg-secondary)]/50 shadow-soft dark:border-[var(--border)]/40 dark:from-[var(--bg-primary)]/98 dark:via-slate-900/30'
      }`}
    >
      <div className={`container-page flex items-center justify-between gap-3 transition-all duration-300 ${
        isShrunk ? 'h-14 py-2' : 'h-20 py-4'
      }`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="shrink-0"
        >
          <Link to="/">
            <Logo />
          </Link>
        </motion.div>

        {variant === 'marketing' && (
          <nav className="hidden items-center gap-2 md:flex">
            <NavItem to="/#about">About</NavItem>
            <NavItem to="/#features">Features</NavItem>
            <NavItem to="/#testimonials">Testimonials</NavItem>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <DarkModeToggle compact />

          {!isAuthed ? (
            <>
              <Link to="/login" className="btn-ghost hidden md:inline-flex">
                <LogIn size={16} />
                Login
              </Link>
              <Link to="/signup" className="btn-primary ripple">
                <UserPlus size={16} />
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn-ghost hidden md:inline-flex">
                Dashboard
              </Link>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="btn-ghost ripple"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}

