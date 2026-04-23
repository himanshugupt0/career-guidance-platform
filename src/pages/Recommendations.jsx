import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Target } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { CardSkeleton } from '../components/Skeleton.jsx'
import {
  courseRecommendations,
  streamRecommendations,
} from '../data/recommendations.js'

const KEY = 'oscea_test_results'

function loadResults() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function Recommendations() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)

  useEffect(() => {
    function refresh() {
      setResults(loadResults())
    }

    refresh()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const streamHint = results?.streamHint || null
  const profile = results?.profile || 'Explorer'

  const courses = useMemo(() => {
    if (!streamHint) return courseRecommendations.slice()

    return courseRecommendations.slice().sort((a, b) =>
      a.stream === streamHint && b.stream !== streamHint ? -1 : 0
    )
  }, [streamHint])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (!results) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card.glow p-8 max-w-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 flex-shrink-0">
            <Target size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Complete aptitude test first
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Take the aptitude test to unlock your personalized recommendations.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Recommendations"
        subtitle="Personalized guidance based on your aptitude results."
        right={
          <motion.div 
            className="inline-flex items-center gap-2 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-bold text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} />
            Profile: {profile}
          </motion.div>
        }
      />

      {/* 🔥 PRIMARY RESULT CARD */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card.glow ring-2 ring-primary-500/30 shadow-2xl max-w-4xl mx-auto p-8"
      >
        <div className="text-xl font-bold uppercase tracking-wide text-slate-500 mb-6">
          Recommended Stream
        </div>
        
        <div className="text-center">
          <motion.div 
            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            {streamHint}
          </motion.div>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            {results.reason}
          </p>

          {/* Performance Bars */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {Object.entries(results.scores || {}).map(([key, value]) => (
              <motion.div 
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{key}</span>
                  <span className="font-bold text-primary-600">{value}%</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden dark:bg-slate-800">
                  <motion.div 
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full shadow-glow"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stream Cards */}
      <section>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Explore Streams
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          {streamRecommendations.map((stream) => (
            <motion.div
              key={stream.stream}
              className={`card p-6 border-2 ${
                stream.stream === streamHint 
                  ? 'border-primary-500 ring-4 ring-primary-500/20 shadow-2xl' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'
              }`}
              whileHover={{ y: -4 }}
            >
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {stream.stream}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {stream.description}
              </p>
              {stream.stream === streamHint && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold dark:bg-emerald-900/50 dark:text-emerald-200">
                  Your best match
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Course Cards */}
      <section>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Top Course Recommendations
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 6).map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card p-6 hover:shadow-xl transition-all ${
                course.stream === streamHint ? 'ring-2 ring-emerald-500/20' : ''
              }`}
              whileHover={{ y: -4 }}
            >
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {course.title}
              </h4>
              <div className="text-sm font-semibold text-indigo-600 mb-3">
                Stream: <span className="capitalize">{course.stream}</span>
              </div>
              {course.stream === streamHint && (
                <div className="mb-4 text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full inline-block dark:bg-emerald-900/50 dark:text-emerald-200">
                  Perfect match
                </div>
              )}
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                <strong>Careers:</strong> {course.careers.join(', ')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                Duration: {course.duration} • {course.mode}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

