import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Target, User2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader.jsx'
import { useAuth } from '../routes/AuthContext.jsx'
import { courseRecommendations, streamRecommendations } from '../data/recommendations.js'
import { colleges } from '../data/colleges.js'

// Map career interest → relevant courses
const INTEREST_COURSE_MAP = {
  'Engineering': ['B.Tech / BE'],
  'Medical': ['MBBS / BDS / B.Pharm'],
  'Law': ['LLB'],
  'Commerce': ['B.Com / BBA'],
  'Design': ['BA / BJMC / B.Des'],
  'Arts': ['BA / BJMC / B.Des'],
  'Teaching': ['B.Ed'],
  'Government Jobs': ['BA / BJMC / B.Des', 'LLB'],
}

export function Recommendations() {
  const { user, isAuthed } = useAuth()

  const testResult = user?.testResult || null
  const streamHint = testResult?.streamHint || null
  const profile = testResult?.profile || 'Explorer'

  const profileComplete = Boolean(user?.grade && user?.state)
  const hasTest = Boolean(streamHint)

  // Filter colleges by user state + stream
  const suggestedColleges = useMemo(() => {
    if (!streamHint || !user?.state) return []
    return colleges
      .filter(c => {
        const stateMatch = c.state?.toLowerCase() === user.state?.toLowerCase()
        const courseMatch = c.courses?.some(course =>
          course.toLowerCase().includes(streamHint.toLowerCase()) ||
          streamHint.toLowerCase().includes(course.toLowerCase())
        )
        return stateMatch && courseMatch
      })
      .slice(0, 6)
  }, [streamHint, user?.state])

  // Sort courses by stream + career interest
  const rankedCourses = useMemo(() => {
    const interest = user?.careerInterest || ''
    const preferredTitles = INTEREST_COURSE_MAP[interest] || []
    return [...courseRecommendations].sort((a, b) => {
      const aStream = a.stream === streamHint ? 2 : 0
      const aInterest = preferredTitles.includes(a.title) ? 1 : 0
      const bStream = b.stream === streamHint ? 2 : 0
      const bInterest = preferredTitles.includes(b.title) ? 1 : 0
      return (bStream + bInterest) - (aStream + aInterest)
    })
  }, [streamHint, user?.careerInterest])

  // No test taken
  if (!hasTest) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 max-w-lg">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
            <Target size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Take the aptitude test first</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Complete the aptitude test to get personalized stream, course, and college recommendations.
            </p>
            <Link to="/dashboard/test" className="btn-primary text-sm py-2.5">Take Test →</Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Your Recommendations"
        subtitle="Personalized based on your aptitude, profile, and location."
        right={
          <div className="inline-flex items-center gap-2 rounded-2xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/50 px-3 py-1.5 text-xs font-bold text-primary-700 dark:text-primary-300">
            <Sparkles size={14} /> {profile}
          </div>
        }
      />

      {/* Profile incomplete warning */}
      {!profileComplete && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3">
          <User2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Profile incomplete</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Add your class, state, and budget to get college recommendations near you.
            </p>
            <Link to="/dashboard/profile" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline">
              Complete profile <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}

      {/* Stream result */}
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card p-5 sm:p-8 ring-2 ring-primary-500/30 shadow-xl"
      >
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Recommended Stream</div>
        <div className="text-center mb-6">
          <motion.div
            className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-3"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            {streamHint}
          </motion.div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            {testResult?.reason}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {Object.entries(testResult?.scores || {}).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">{key}</span>
                <span className="text-sm font-bold text-primary-600">{value}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stream options */}
      <section>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Explore Streams</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {streamRecommendations.map(stream => (
            <motion.div
              key={stream.stream}
              whileHover={{ y: -3 }}
              className={`card p-4 sm:p-5 border-2 transition-all ${
                stream.stream === streamHint
                  ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-lg'
                  : 'border-slate-200 dark:border-slate-800 hover:border-primary-300'
              }`}
            >
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">{stream.stream}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{stream.description}</p>
              {stream.stream === streamHint && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                  ✓ Your best match
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Course recommendations */}
      <section>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Top Course Picks</h3>
        {user?.careerInterest && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Based on your interest in <b>{user.careerInterest}</b> + {streamHint} stream.
          </p>
        )}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {rankedCourses.slice(0, 6).map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              className={`card p-4 sm:p-5 ${course.stream === streamHint ? 'ring-2 ring-emerald-500/20' : ''}`}
            >
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{course.title}</h4>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 capitalize">{course.stream}</div>
              {course.stream === streamHint && (
                <span className="inline-block mb-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
                  Stream match
                </span>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <b>Careers:</b> {course.careers.join(', ')}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nearby colleges */}
      {suggestedColleges.length > 0 && (
        <section>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Government Colleges Near You
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {streamHint} colleges in {user?.state} matching your profile.
          </p>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedColleges.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card p-4 sm:p-5"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white leading-snug mb-1">{c.name}</div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">{c.district}, {c.state}</div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.courses.map(x => (
                    <span key={x} className="rounded-full border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">{x}</span>
                  ))}
                </div>
                {c.website && (
                  <a href={c.website} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">Visit →</a>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/dashboard/colleges" className="btn-ghost text-sm py-2">
              See all colleges →
            </Link>
          </div>
        </section>
      )}

      {/* No nearby colleges but profile has state */}
      {suggestedColleges.length === 0 && user?.state && hasTest && (
        <div className="card p-5 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            No {streamHint} colleges found in <b>{user.state}</b> in our database yet.
          </p>
          <Link to="/dashboard/colleges" className="btn-primary text-sm py-2.5">Browse all colleges →</Link>
        </div>
      )}
    </div>
  )
}