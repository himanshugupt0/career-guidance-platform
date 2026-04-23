import { GraduationCap } from 'lucide-react'

export function Logo({ size = 'md' }) {
  const iconSize = size === 'sm' ? 18 : 22
  const textSize = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-indigo-600 text-white shadow-soft">
        <GraduationCap size={iconSize} />
      </div>
      <div className="leading-tight">
        <div className={`font-extrabold tracking-tight ${textSize}`}>
          One-Stop Advisor
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Career & Education Guidance
        </div>
      </div>
    </div>
  )
}

