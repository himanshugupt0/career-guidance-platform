import { Mail, MapPin } from 'lucide-react'
import { Logo } from './Logo.jsx'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page grid gap-8 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Personalized guidance for students after Class 10 and 12 — explore
            streams, courses, careers, and government colleges with confidence.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            Quick links
          </div>
          <div className="grid gap-2 text-slate-600 dark:text-slate-300">
            <a className="hover:text-indigo-600" href="/#features">
              Features
            </a>
            <a className="hover:text-indigo-600" href="/#testimonials">
              Testimonials
            </a>
            <a className="hover:text-indigo-600" href="/signup">
              Get started
            </a>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            Contact
          </div>
          <div className="grid gap-2 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>hello@careerguidance.in</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} One-Stop Personalized Career & Education
        Advisor. All rights reserved.
      </div>
    </footer>
  )
}

