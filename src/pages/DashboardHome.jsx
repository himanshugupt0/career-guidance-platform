import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, BookOpen, Compass, Target, Sparkles, ArrowRight } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

const cards = [
  {
    title: 'Aptitude Test',
    description: 'Quick MCQs reveal your natural strengths & career fit.',
    to: '/dashboard/test',
    icon: Target,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Recommendations',
    description: 'Personalized career paths & streams tailored to you.',
    to: '/dashboard/recommendations',
    icon: Compass,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Colleges',
    description: '4000+ govt colleges with filters, favorites & eligibility.',
    to: '/dashboard/colleges',
    icon: BookOpen,
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    title: 'Alerts',
    description: 'Real-time exam, admission & scholarship notifications.',
    to: '/dashboard/alerts',
    icon: Bell,
    gradient: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function DashboardHome() {
  const { user } = useAuth()
  const profileComplete = Boolean(user?.grade && user?.state)
  const isNewUser = !profileComplete

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6 sm:space-y-8 pt-2 sm:pt-4"
    >
      <PageHeader
        title={`Welcome${user?.name ? `, ${user.name}!` : '!'}`}
        subtitle="Your personalized career guidance dashboard"
      />

      {/* New user banner — profile complete karne ki request */}
      {isNewUser && (
        <motion.div
          variants={cardVariants}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-600 p-5 sm:p-6 text-white shadow-xl"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Sparkles size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg leading-snug">Complete your profile first</h3>
              <p className="mt-1 text-sm text-white/80 leading-relaxed">
                It takes just <b>30 seconds</b>. Add your class, state, and interests — so we can recommend the right colleges and careers for you.
              </p>
            </div>
            <Link
              to="/dashboard/profile"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-indigo-700 font-bold text-sm px-4 py-2.5 hover:bg-indigo-50 transition-all shadow-md"
            >
              Set up profile <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Main Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {cards.map((card) => (
          <motion.div key={card.title} variants={cardVariants} whileHover={{ y: -4, scale: 1.01 }} className="group">
            <Link
              to={card.to}
              className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-30 blur-xl`} />
              <div className={`relative shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm`}>
                <card.icon size={22} className={card.iconColor} />
              </div>
              <div className="relative min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{card.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{card.description}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                  Open →
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Quick Actions */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { title: 'Aptitude Test', desc: '2 min test', to: '/dashboard/test', icon: Target },
          { title: 'View Recs', desc: 'Career matches', to: '/dashboard/recommendations', icon: Compass },
          { title: 'Find Colleges', desc: '4000+ listed', to: '/dashboard/colleges', icon: BookOpen },
        ].map((action) => (
          <motion.div key={action.title} whileHover={{ scale: 1.03 }} className="group">
            <Link
              to={action.to}
              className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-2 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-all">
                <action.icon size={18} className="text-primary-600" />
              </div>
              <div className="text-left sm:text-center">
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{action.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{action.desc}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}