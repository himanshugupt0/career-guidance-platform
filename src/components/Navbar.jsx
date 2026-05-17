import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useScroll, motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, UserPlus, Menu, X } from 'lucide-react'
import { Logo } from './Logo.jsx'
import { DarkModeToggle } from './DarkModeToggle.jsx'
import { useAuth } from '../routes/AuthContext.jsx'
import { useEffect, useState } from 'react'

function NavItem({ to, children, onClick }) {
  return (
    <button
      onClick={() => {
        onClick?.()
        const el = document.querySelector(to)
        el?.scrollIntoView({ behavior: 'smooth' })
      }}
      className="rounded-2xl px-4 py-2.5 text-sm font-bold transition-all cursor-pointer hover:bg-slate-100/50 hover:shadow-float dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-200 w-full text-left md:w-auto"
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
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    return scrollY.on('change', (latest) => setIsShrunk(latest > 50))
  }, [scrollY])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 backdrop-blur-2xl transition-all duration-500 border-b shadow-float/50 ${
          isShrunk
            ? 'shadow-glow-lg border-[var(--border)]/50 bg-[var(--bg-card)]/95 dark:border-[var(--border)]/50 dark:bg-[var(--bg-primary)]/95'
            : 'border-[var(--border)]/30 bg-gradient-to-b from-[var(--bg-primary)]/98 via-primary-50/30 to-[var(--bg-secondary)]/50 shadow-soft dark:border-[var(--border)]/40 dark:from-[var(--bg-primary)]/98 dark:via-slate-900/30'
        }`}
      >
        <div className={`container-page flex items-center justify-between gap-3 transition-all duration-300 ${isShrunk ? 'h-14 py-2' : 'h-16 sm:h-20 py-3 sm:py-4'}`}>
          <motion.div whileHover={{ scale: 1.05 }} className="shrink-0">
            <Link to="/">
              <Logo />
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          {variant === 'marketing' && (
            <nav className="hidden items-center gap-2 md:flex">
              <NavItem to="#about">About</NavItem>
              <NavItem to="#features">Features</NavItem>
              <NavItem to="#testimonials">Testimonials</NavItem>
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <DarkModeToggle compact />
            {!isAuthed ? (
              <>
                <Link to="/login" className="btn-ghost">
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
                <Link to="/dashboard" className="btn-ghost">
                  Dashboard
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="btn-ghost ripple"
                  onClick={() => { logout(); navigate('/') }}
                >
                  <LogOut size={16} />
                  Logout
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile: darkmode + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <DarkModeToggle compact />
            <button
              className="btn-ghost p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden"
              onClick={closeMobile}
            />
            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-[56px] z-50 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xl px-4 py-4 space-y-2"
            >
              {variant === 'marketing' && (
                <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <NavItem to="#about" onClick={closeMobile}>About</NavItem>
                  <NavItem to="#features" onClick={closeMobile}>Features</NavItem>
                  <NavItem to="#testimonials" onClick={closeMobile}>Testimonials</NavItem>
                </div>
              )}

              {!isAuthed ? (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="btn-ghost w-full justify-center" onClick={closeMobile}>
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary w-full justify-center ripple" onClick={closeMobile}>
                    <UserPlus size={16} />
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/dashboard" className="btn-ghost w-full justify-center" onClick={closeMobile}>
                    Dashboard
                  </Link>
                  <button
                    className="btn-ghost w-full justify-center ripple"
                    onClick={() => { logout(); navigate('/'); closeMobile() }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
