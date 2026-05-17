import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, RefreshCw, User2 } from 'lucide-react'
import { aptitudeQuestions, scoreToProfile } from '../data/aptitude.js'
import { useAuth } from '../routes/AuthContext.jsx'
import api from '../api.js'

const STORAGE_KEY = 'aptitude_progress'
const RESULT_KEY = 'oscea_test_results'

export function AptitudeTest() {
  const { user, isAuthed } = useAuth()
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const profileComplete = Boolean(user?.grade && user?.state)

  const q = aptitudeQuestions[current]
  const progress = ((current + 1) / aptitudeQuestions.length) * 100
  const allAnswered = Object.keys(answers).length >= aptitudeQuestions.length

  useEffect(() => {
    if (isAuthed && user?.testResult?.streamHint) {
      setResult(user.testResult)
      setShowResults(true)
      return
    }
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (saved.answers && saved.result) {
      setAnswers(saved.answers)
      setResult(saved.result)
      setShowResults(true)
    } else if (saved.answers) {
      setAnswers(saved.answers)
      setCurrent(saved.current || 0)
    }
  }, [isAuthed, user])

  useEffect(() => {
    if (!showResults) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, current, result }))
    }
  }, [answers, current, result, showResults])

  function handleAnswer(index) {
    setAnswers(prev => ({ ...prev, [q.id]: index }))
    setShowResults(false)
  }

  function nextQuestion() { setCurrent(prev => Math.min(prev + 1, aptitudeQuestions.length - 1)) }
  function prevQuestion() { setCurrent(prev => Math.max(prev - 1, 0)) }

  async function handleSubmit() {
    setIsSubmitting(true)
    setSaveError(false)
    await new Promise(r => setTimeout(r, 1200))
    const res = scoreToProfile(answers)
    setResult(res)
    setShowResults(true)
    localStorage.setItem(RESULT_KEY, JSON.stringify(res))
    localStorage.setItem('userStream', res.streamHint)
    localStorage.removeItem(STORAGE_KEY)
    if (isAuthed) {
      try {
        await api.post('/submit-test', { streamHint: res.streamHint, profile: res.profile, reason: res.reason, scores: res.scores })
      } catch { setSaveError(true) }
    }
    setIsSubmitting(false)
  }

  function resetTest() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(RESULT_KEY)
    localStorage.removeItem('userStream')
    setAnswers({})
    setCurrent(0)
    setResult(null)
    setShowResults(false)
    setSaveError(false)
  }

  // Block test if profile not complete
  if (!profileComplete) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
        <div className="card p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <User2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Complete your profile first</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your <b>class</b> and <b>state</b> are required before taking the test. This helps us save your results and recommend the right colleges near you.
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-3 mb-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Missing fields</div>
            <div className="grid gap-1.5">
              {!user?.grade && (
                <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> Class not set
                </div>
              )}
              {!user?.state && (
                <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> State not set
                </div>
              )}
            </div>
          </div>
          <Link to="/dashboard/profile" className="btn-primary w-full justify-center py-3">
            Complete Profile — takes 30 seconds →
          </Link>
        </div>
      </motion.div>
    )
  }

  // Results screen
  if (result && showResults) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-2 sm:px-0">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-6 sm:p-8 text-center">
          {saveError && (
            <div className="mb-4 text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800">
              Saved locally. Will sync when connection is restored.
            </div>
          )}
          <div className="inline-block px-6 py-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl text-white shadow-xl mb-6">
            <div className="text-3xl sm:text-4xl font-black mb-1">{result.streamHint}</div>
            <div className="opacity-90 text-sm">Your best stream match</div>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 px-2">{result.reason}</h2>
          <div className="space-y-4 mb-8 text-left">
            {Object.entries(result.scores || {}).map(([category, score]) => (
              <div key={category}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-semibold text-sm capitalize text-slate-700 dark:text-slate-200">{category}</span>
                  <span className="font-bold text-sm text-primary-600">{score}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <motion.div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/dashboard/recommendations" className="btn-primary flex-1 justify-center py-3">View Recommendations →</Link>
            <button onClick={resetTest} className="btn-ghost flex-1 justify-center py-3"><RefreshCw size={15} className="mr-1" /> Retake</button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Question screen
  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-6 px-2 sm:px-0">
      <motion.div className="card p-5 sm:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Question {current + 1} of {aptitudeQuestions.length}</span>
            <span className="text-sm font-bold text-primary-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>
        <motion.h1 key={current} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 leading-snug" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {q.question}
        </motion.h1>
        <div className="space-y-2.5 mb-8">
          {q.options.map((opt, i) => (
            <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(i)}
              className={`w-full p-4 rounded-xl text-left font-medium text-sm sm:text-base transition-all duration-200 border-2 ${
                answers[q.id] === i
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white border-primary-500 shadow-lg'
                  : 'bg-white/70 dark:bg-slate-900/70 text-slate-800 dark:text-slate-200 border-slate-200/50 dark:border-slate-800/50 hover:border-primary-400 hover:shadow-md'
              }`}>
              <span className="font-bold mr-2 opacity-70">{String.fromCharCode(65 + i)}.</span>{opt}
            </motion.button>
          ))}
        </div>
        <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <button onClick={prevQuestion} disabled={current === 0} className="btn-ghost flex-1 justify-center disabled:opacity-40 py-2.5">
            <ArrowLeft size={16} className="mr-1" /> Prev
          </button>
          {current === aptitudeQuestions.length - 1 ? (
            <button onClick={handleSubmit} disabled={isSubmitting || !allAnswered} className="btn-primary flex-1 justify-center disabled:opacity-50 py-2.5">
              {isSubmitting ? <><RefreshCw className="animate-spin mr-1.5" size={16} /> Saving...</> : 'See Results →'}
            </button>
          ) : (
            <button onClick={nextQuestion} className="btn-primary flex-1 justify-center py-2.5">Next <ArrowRight size={16} className="ml-1" /></button>
          )}
        </div>
        <div className="mt-3 text-center text-xs text-slate-400">{Object.keys(answers).length} of {aptitudeQuestions.length} answered</div>
      </motion.div>
    </div>
  )
}