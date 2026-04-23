import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react'
import { aptitudeQuestions, scoreToProfile } from '../data/aptitude.js'

const STORAGE_KEY = "aptitude_progress"

export function AptitudeTest() {
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(true)

  const q = aptitudeQuestions[current]
  const progress = ((current + 1) / aptitudeQuestions.length) * 100

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (saved.answers && saved.result) {
      setAnswers(saved.answers)
      setResult(saved.result)
      setShowResults(true)
    } else if (saved.answers) {
      setAnswers(saved.answers)
      setCurrent(saved.current || 0)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, current, result }))
  }, [answers, current, result])

  function handleAnswer(index) {
    setAnswers(prev => ({ ...prev, [q.id]: index }))
    setShowResults(false)
  }

  function nextQuestion() {
    setCurrent(prev => Math.min(prev + 1, aptitudeQuestions.length - 1))
    setShowResults(false)
  }

  function prevQuestion() {
    setCurrent(prev => Math.max(prev - 1, 0))
    setShowResults(false)
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const res = scoreToProfile(answers)
    setResult(res)
    setShowResults(true)
    
    localStorage.setItem("oscea_test_results", JSON.stringify(res))
    localStorage.setItem("userStream", res.streamHint)
    
    setIsSubmitting(false)
  }

  function resetTest() {
    localStorage.removeItem(STORAGE_KEY)
    setAnswers({})
    setCurrent(0)
    setResult(null)
    setShowResults(false)
  }

  if (result && showResults) {
    return (
      <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
        <div className="card.glow p-8 md:p-12 text-center max-w-2xl mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-12"
          >
            <div className="inline-block p-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl text-white shadow-2xl mb-8 mx-auto">
              <div className="text-4xl font-black mb-2">{result.streamHint}</div>
              <div className="opacity-90 text-lg">Perfect stream match!</div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {result.reason}
            </h2>

            <div className="space-y-6 mb-12 max-w-lg mx-auto">
              {Object.entries(result.scores).map(([category, score]) => (
                <div key={category} className="text-left">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold capitalize">{category}</span>
                    <span className="font-bold text-2xl">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden dark:bg-slate-800">
                    <motion.div 
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard/recommendations"
              className="btn-primary w-full font-bold py-4 text-lg shadow-2xl hover:shadow-glow-lg flex-1"
            >
              View Full Report →
            </Link>
            <button
              onClick={resetTest}
              className="btn-ghost w-full font-semibold py-4 border-2 hover:border-slate-300 flex-1"
            >
              Retake Test
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
      <motion.div 
        className="card.glow p-8 md:p-12 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {current + 1} / {aptitudeQuestions.length}
            </div>
            <div className="w-48">
              <div className="flex justify-between text-sm font-bold text-slate-500 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          <motion.h1 
            className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 text-center"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            {q.question}
          </motion.h1>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-12">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(i)}
              className={`group relative w-full p-6 rounded-2xl text-left font-semibold text-lg transition-all duration-300 backdrop-blur-xl overflow-hidden border-2 ${
                answers[q.id] === i
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white border-primary-500 shadow-xl ring-2 ring-primary-500/30 scale-[1.02]'
                  : 'bg-white/70 text-slate-800 border-slate-200/50 hover:border-primary-400 hover:bg-white hover:shadow-lg hover:-translate-y-1 dark:bg-slate-900/70 dark:text-slate-200 dark:border-slate-800/50 dark:hover:bg-slate-900/90'
              }`}
            >
              <span className="relative z-10 block">
                {String.fromCharCode(65 + i)}. {opt}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-12 border-t border-slate-200/30 dark:border-slate-800/30">
          <motion.button
            onClick={prevQuestion}
            disabled={current === 0}
            className="btn-ghost flex-1 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={20} className="mr-2" />
            Previous
          </motion.button>

          <div className="flex-1" />

          {current === aptitudeQuestions.length - 1 ? (
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(answers).length < aptitudeQuestions.length}
              className="btn-primary flex-1 font-bold shadow-xl hover:shadow-glow-lg disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="animate-spin mr-2" size={20} />
                  Analyzing...
                </>
              ) : (
                'See My Results →'
              )}
            </motion.button>
          ) : (
            <motion.button
              onClick={nextQuestion}
              className="btn-primary flex-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Next Question
              <ArrowRight size={20} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

