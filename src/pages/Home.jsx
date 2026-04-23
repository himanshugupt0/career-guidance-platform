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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950" />
          <div className="container-page py-14 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
                  <CheckCircle2 size={16} />
                  One-Stop Personalized Career & Education Advisor
                </div>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Choose the right path after Class 10 & 12 — with clarity.
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  Explore streams, courses, and career options. Take an aptitude
                  test, discover recommendations, and find government colleges —
                  all in one modern, student-friendly platform.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to={isAuthed ? '/dashboard' : '/signup'}
                    className="btn-primary"
                  >
                    Get Started <ArrowRight size={16} />
                  </Link>
                  <a href="#features" className="btn-ghost">
                    Explore features
                  </a>
                </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
            <motion.div 
              className="group card backdrop-blur-xl p-6 border-0 shadow-float hover:shadow-glow-lg transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.05 }}
              viewport={{ once: true }}
            >
              <div className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-3">
                Built for
              </div>
              <div className="text-xl font-black text-[var(--text-primary)] group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:bg-clip-text group-hover:text-transparent">
                Class 10 & 12
              </div>
            </motion.div>
            <motion.div 
              className="group card backdrop-blur-xl p-6 border-0 shadow-float hover:shadow-glow-lg transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.05 }}
              viewport={{ once: true }}
            >
              <div className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-3">
                Focus
              </div>
              <div className="text-xl font-black text-[var(--text-primary)] group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:bg-clip-text group-hover:text-transparent">
                Govt Colleges
              </div>
            </motion.div>
            <motion.div 
              className="group card backdrop-blur-xl p-6 border-0 shadow-float hover:shadow-glow-lg transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.05 }}
              viewport={{ once: true }}
            >
              <div className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-3">
                Setup
              </div>
              <div className="text-xl font-black text-[var(--text-primary)] group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:bg-clip-text group-hover:text-transparent">
                Zero Config
              </div>
            </motion.div>
          </div>
              </div>

              <div className="relative">
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Your next steps
                    </div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Demo flow
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {(isAuthed 
                      ? [
                          'Take Aptitude Test',
                          'View Recommendations', 
                          'College Directory',
                          'Dashboard & Alerts'
                        ]
                      : [
                          '1. Create Profile',
                          '2. Take Aptitude Test',
                          '3. View Recommendations',
                          '4. College Directory'
                        ]
                    ).map((step, index) => (
                      <motion.div
                        key={step}
                        className="group flex items-start gap-3 rounded-2xl border border-slate-200/50 bg-white/70 p-6 backdrop-blur cursor-pointer hover:bg-white hover:shadow-glow-lg hover:-translate-y-1 transition-all duration-300 dark:border-slate-800/50 dark:bg-slate-950/40 hover:dark:bg-slate-900/60"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          if (isAuthed) {
                            if (step === 'Take the aptitude test') window.location.href = '/dashboard/test'
                            else if (step === 'View recommendations') window.location.href = '/dashboard/recommendations'
                            else if (step === 'Find colleges & track alerts') window.location.href = '/dashboard/colleges'
                            else window.location.href = '/dashboard'
                          } else {
                            window.location.href = '/signup'
                          }
                        }}
                      >
                        <div className="mt-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold shadow-glow-lg group-hover:scale-110 transition-all">
{index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-xl text-[var(--text-primary)] mb-1">
                            {step}
                          </div>
                          <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {isAuthed 
                              ? `Ready in your dashboard. ${step.toLowerCase()}`
                              : 'Complete to unlock personalized career insights and college recommendations.'
                            }
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-primary-500 transition-colors ml-2 opacity-0 group-hover:opacity-100" />
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

        <section id="about" className="container-page py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                About the platform
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                After Class 10 or 12, it’s common to feel unsure. This platform
                helps you explore options logically — streams, courses, and
                career paths — and connects you with a simple college directory
                and alerts for important opportunities.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Student-first explanations',
                  'Clear next steps',
                  'Mobile-friendly UI',
                  'Fast, lightweight app',
                ].map((x) => (
                  <div key={x} className="flex items-center gap-2 text-sm">
                    <span className="text-indigo-600 dark:text-indigo-300">
                      <CheckCircle2 size={16} />
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {x}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              {isAuthed ? (
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] mb-4">
                    Welcome back! 👋
                  </h3>
                  <p className="text-lg text-[var(--text-secondary)] mb-6">
                    Continue your journey from where you left off.
                  </p>
                  <Link to="/dashboard" className="inline-flex items-center gap-2 btn-primary">
                    Go to Dashboard <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  What you&apos;ll get
                </div>
              )}
              <div className="mt-3 grid gap-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/30"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
                      <f.icon size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {f.title}
                      </div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {f.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container-page py-20 bg-gradient-to-b from-[var(--bg-secondary)]/50 to-transparent">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-[var(--text-primary)] via-primary-600 to-accent-500 bg-clip-text text-transparent">
              Everything you need
            </h2>
            <p className="mt-4 text-xl text-[var(--text-secondary)] leading-relaxed">
              Move from confusion → clarity in minutes.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div 
                key={f.title} 
                className="group card.glow p-8 h-64 flex flex-col justify-between border-0 shadow-float hover:shadow-glow-lg hover:-translate-y-4 transition-all duration-700"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateX: 2 }}
                viewport={{ once: true }}
              >
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary-400/20 to-accent-400/20 backdrop-blur-xl text-primary-600 shadow-glow group-hover:shadow-glow-lg group-hover:scale-110 transition-all duration-500 mx-auto">
                  <f.icon size={28} className="drop-shadow-2xl" />
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-black text-[var(--text-primary)] group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-accent-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="testimonials"
          className="border-y border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-950/50"
        >
          <div className="container-page">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Testimonials
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Real student experiences.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="card p-6">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    “{t.quote}”
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {t.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {t.grade}
                      </div>
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

