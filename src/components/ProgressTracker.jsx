import { motion } from 'framer-motion'

export function ProgressTracker({ current, total, className = '' }) {
  const progress = (current / total) * 100

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-400">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-slate-200/50 h-4 rounded-2xl overflow-hidden backdrop-blur-xl border border-slate-200/30 dark:border-slate-800/50">
        <motion.div 
          className="bg-gradient-to-r from-primary-500 via-accent-500 to-cyan-500 h-4 rounded-2xl shadow-glow relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer [background-size:200%_100%]" />
        </motion.div>
      </div>
      <div className="flex gap-1 text-xs text-slate-500">
        <span>{current}</span>
        <span>/</span>
        <span className="font-bold">{total}</span>
      </div>
    </div>
  )
}

