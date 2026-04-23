import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, BookOpen, Compass, Target, GraduationCap } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

const cards = [
  {
    title: 'Aptitude Test',
    description: 'Quick MCQs reveal your natural strengths & career fit.',
    to: '/dashboard/test',
    icon: Target,
  },
  {
    title: 'Recommendations',
    description: 'Personalized career paths & streams tailored to you.',
    to: '/dashboard/recommendations',
    icon: Compass,
  },
  {
    title: 'Colleges',
    description: '4000+ govt colleges with filters, favorites & eligibility.',
    to: '/dashboard/colleges',
    icon: BookOpen,
  },
  {
    title: 'Alerts',
    description: 'Real-time exam, admission & scholarship notifications.',
    to: '/dashboard/alerts',
    icon: Bell,
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  },
  whileHover: {
    y: -8,
    scale: 1.02,
  }
}

export function DashboardHome() {
  const { user } = useAuth()

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-8 pt-4"
    >
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name}!` : ''}`}
        subtitle="Your personalized career guidance dashboard"
      />

      {/* Hero Cards - Compact & Uniform */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            whileHover="whileHover"
            className="group"
          >
            <Link
              to={card.to}
              className="block h-[340px] p-6 rounded-3xl bg-gradient-to-br from-white/80 via-white/60 to-slate-50/80 backdrop-blur-xl border border-slate-200/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950/60 dark:border-slate-800/50 dark:shadow-2xl relative overflow-hidden"
            >
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 blur-xl" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <card.icon size={24} className="text-primary-600" />
                </div>

                {/* Title & Description */}
                <div className="text-center flex-grow flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed px-2">
                    {card.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 rounded-xl text-primary-700 font-semibold text-sm transition-all group-hover:scale-105">
                    Get started →
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Profile & Quick Actions - Clean Layout */}
      <section className="grid md:grid-cols-12 gap-6">
        {/* Profile Card */}
        <motion.div 
          className="md:col-span-4 p-6 rounded-3xl bg-gradient-to-br from-white/80 via-white/60 backdrop-blur-xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all dark:from-slate-900/60 dark:via-slate-900/40 dark:border-slate-800/50"
          variants={cardVariants}
        >
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-4 dark:text-slate-400">
            Your Profile
          </h4>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user?.email || '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Stream</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                {localStorage.getItem('userStream') || 'Take test'}
              </span>
            </div>
          </div>
          <Link to="/dashboard/profile" className="w-full block text-center py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            Update Profile
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Aptitude Test', desc: '2 min test', to: '/dashboard/test', icon: Target },
            { title: 'View Recs', desc: 'Career matches', to: '/dashboard/recommendations', icon: Compass },
            { title: 'Find Colleges', desc: '4000+ listed', to: '/dashboard/colleges', icon: BookOpen }
          ].map((action) => (
            <motion.div 
              key={action.title}
              whileHover={{ scale: 1.02 }}
              className="group p-5 rounded-2xl bg-gradient-to-b from-slate-50/70 to-white/60 backdrop-blur hover:from-slate-100 hover:shadow-md transition-all border border-slate-200/40 dark:from-slate-900/50 dark:to-slate-950/30 dark:border-slate-800/30"
            >
              <Link to={action.to} className="block h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-3 group-hover:bg-primary-500/20 transition-all">
                  <action.icon size={20} className="text-primary-600" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{action.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{action.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}

