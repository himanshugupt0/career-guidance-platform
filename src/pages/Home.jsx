import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { features } from '../data/features.js'
import { testimonials } from '../data/testimonials.js'
import { useAuth } from '../routes/AuthContext.jsx'

export function Home() {
  const { isAuthed } = useAuth()

  const steps = isAuthed
    ? ['Take Aptitude Test', 'View Recommendations', 'College Directory', 'Dashboard & Alerts']
    : ['1. Create Profile', '2. Take Aptitude Test', '3. View Recommendations', '4. College Directory']

  const stepLinks = {
    'Take Aptitude Test': '/dashboard/test',
    'View Recommendations': '/dashboard/recommendations',
    'College Directory': '/dashboard/colleges',
    'Dashboard & Alerts': '/dashboard',
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950" />
          <div className="container-page py-10 sm:py-16 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">

              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
                  <CheckCircle2 size={14} />
                  One-Stop Personalized Career & Education Advisor
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                  Choose the right path after Class 10 & 12 — with clarity.
                </h1>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  Explore streams, courses, and career options. Take an aptitude test, discover recommendations, and find government colleges — all in one modern, student-friendly platform.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link to={isAuthed ? '/dashboard' : '/signup'} className="btn-primary text-center justify-center">
                    Get Started <ArrowRight size={16} />
                  </Link>
                  <a href="#features" className="btn-ghost text-center justify-center">
                    Explore features
                  </a>
                </div>

                {/* Stats chips */}
                <div className="mt-10 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Built for', value: 'Class 10 & 12' },
                    { label: 'Focus', value: 'Govt Colleges' },
                    { label: 'Setup', value: 'Zero Config' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="group card p-4 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4, scale: 1.04 }}
                    >
                      <div className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-1">
                        {stat.label}
                      </div>
                      <div className="text-sm sm:text-base font-black text-[var(--text-primary)]">
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right — Steps Card */}
              <div className="relative">
                <div className="card p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">Your next steps</div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Demo flow</div>
                  </div>
                  <div className="grid gap-3">
                    {steps.map((step, index) => (
                      <motion.div
                        key={step}
                        className="group flex items-start gap-3 rounded-2xl border border-slate-200/50 bg-white/70 p-4 sm:p-5 backdrop-blur cursor-pointer hover:bg-white hover:shadow-glow-lg hover:-translate-y-1 transition-all duration-300 dark:border-slate-800/50 dark:bg-slate-950/40 hover:dark:bg-slate-900/60"
                        whileHover={{ scale: 1.01 }}
                        onClick={() => {
                          const href = isAuthed ? (stepLinks[step] || '/dashboard') : '/signup'
                          window.location.href = href
                        }}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-bold shadow-glow-lg group-hover:scale-110 transition-all">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-base text-[var(--text-primary)]">{step}</div>
                          <div className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                            {isAuthed ? `Ready in your dashboard.` : 'Complete to unlock personalized career insights.'}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100 mt-1" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -top-10 hidden h-40 w-40 rounded-full bg-indigo-200/40 blur-2xl dark:bg-indigo-900/40 lg:block" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 hidden h-40 w-40 rounded-full bg-blue-200/40 blur-2xl dark:bg-blue-900/40 lg:block" />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="container-page py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                About the platform
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                After Class 10 or 12, it's common to feel unsure. This platform helps you explore options logically — streams, courses, and career paths — and connects you with a simple college directory and alerts for important opportunities.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {['Student-first explanations', 'Clear next steps', 'Mobile-friendly UI', 'Fast, lightweight app'].map((x) => (
                  <div key={x} className="flex items-center gap-2 text-sm">
                    <span className="text-indigo-600 dark:text-indigo-300 shrink-0">
                      <CheckCircle2 size={15} />
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{x}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5 sm:p-6">
              {isAuthed ? (
                <div className="mb-4">
                  <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">Welcome back! 👋</h3>
                  <p className="text-[var(--text-secondary)] mb-4">Continue your journey from where you left off.</p>
                  <Link to="/dashboard" className="inline-flex items-center gap-2 btn-primary">
                    Go to Dashboard <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  What you&apos;ll get
                </div>
              )}
              <div className="grid gap-3">
                {features.map((f) => (
                  <div key={f.title} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-950/30">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
                      <f.icon size={16} />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white">{f.title}</div>
                      <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{f.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container-page py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-[var(--text-primary)] via-primary-600 to-accent-500 bg-clip-text text-transparent">
              Everything you need
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              Move from confusion → clarity in minutes.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group card p-6 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.03 }}
              >
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary-400/20 to-accent-400/20 backdrop-blur-xl text-primary-600 shadow-glow group-hover:shadow-glow-lg group-hover:scale-110 transition-all duration-500 mb-5">
                  <f.icon size={24} />
                </div>
                <h3 className="text-lg font-black text-[var(--text-primary)]">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="border-y border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="container-page">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Testimonials
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Real student experiences.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="card p-5 sm:p-6">
                  <div className="text-sm text-slate-600 dark:text-slate-300">"{t.quote}"</div>
                  <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">{t.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{t.grade}</div>
                    </div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                      Student Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
