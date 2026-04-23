import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, GraduationCap, Landmark, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader.jsx'
import { CardSkeleton } from '../components/Skeleton.jsx'
import api from '../api.js'
import { sampleCollegeAlerts } from '../data/sampleCollegeAlerts.js'

const iconByType = {
  admission: GraduationCap,
  scholarship: Bell,
  exam: Landmark,
  result: Heart,
}

export function Alerts() {
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await api.get('/alerts')
        setAlerts(res.data.alerts || [])
        setFavorites(res.data.favorites || [])
        setLoading(false)
      } catch {
        const demoAlerts = sampleCollegeAlerts.map((a, index) => ({
          ...a,
          id: `demo-${index}`,
          read: false,
          collegeId: a.collegeId
        }))
        setAlerts(demoAlerts)
        setFavorites([])
        setLoading(false)
      }
    }
    loadAlerts()
  }, [])

  const grouped = useMemo(() => {
    const out = {}
    alerts.forEach(a => {
      out[a.type] = out[a.type] || []
      out[a.type].push(a)
    })
    return out
  }, [alerts])

  async function markRead(alertIds) {
    try {
      await api.post('/alerts/read', { alertIds })
      setAlerts(prev => prev.map(a => 
        alertIds.includes(a.id || a._id) ? { ...a, read: true } : a
      ))
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  const unreadCount = alerts.filter(a => !a.read).length

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Alerts & Notifications"
          subtitle="Loading your updates..."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Alerts & Notifications"
        subtitle={`Your favorite colleges updates • ${unreadCount} unread`}
      />

      {alerts.length === 0 ? (
        <div className="text-center py-24">
          <Bell className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            No alerts yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Add colleges to favorites to receive personalized admission, scholarship, and exam updates.
          </p>
          <Link to="/dashboard/colleges" className="btn-primary">
            Find Colleges
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => {
            const Icon = iconByType[type] || Bell
            return (
              <section key={type}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 text-primary-700 dark:from-primary-900/40 dark:to-accent-900/40 dark:text-primary-300">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {items.length} {items.length === 1 ? 'notification' : 'notifications'}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((a) => {
                    const isUnread = !a.read
                    const alertId = a.id || a._id.toString()
                    
                    return (
                      <motion.div 
                        key={alertId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`card p-6 relative group hover:shadow-glow-lg transition-all border-l-4 ${
                          isUnread 
                            ? 'border-primary-500 bg-gradient-to-r bg-primary-50/50 dark:bg-primary-950/30 shadow-lg' 
                            : 'border-slate-200/50 dark:border-slate-800/50'
                        }`}
                      >
                        {isUnread && (
                          <motion.div 
                            className="absolute -top-3 -right-3 w-6 h-6 bg-primary-500 rounded-full text-white text-xs grid place-items-center font-bold shadow-lg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            New
                          </motion.div>
                        )}
                        
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="text-lg font-extrabold text-slate-900 dark:text-white line-clamp-2">
                            {a.title}
                          </div>
                          <div className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                            isUnread 
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200' 
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300'
                          }`}>
                            {a.date || new Date(a.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className={`text-sm leading-relaxed ${isUnread ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
                          {a.collegeName && (
                            <span className="inline-flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 font-semibold">
                              <Heart size={14} className="text-rose-500" />
                              <span>{a.collegeName}</span>
                            </span>
                          )}
                          {a.description}
                        </p>
                        
                        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                            <span className="capitalize">{a.type}</span>
                            {a.collegeId && (
                              <span>• College ID: {a.collegeId}</span>
                            )}
                          </div>
                          
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              className="flex-1 btn-ghost justify-center font-semibold"
                              onClick={() => markRead([alertId])}
                              disabled={a.read}
                            >
                              {a.read ? '✓ Read' : 'Mark read'}
                            </button>
                            <button
                              type="button"
                              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl hover:shadow-md transition-all"
                              onClick={async () => {
                                try {
                                  await api.delete(`/alerts/${alertId}`)
                                  setAlerts(prev => prev.filter(al => al.id !== alertId && al._id !== alertId))
                                } catch (err) {
                                  console.error('Delete failed:', err)
                                }
                              }}
                              title="Delete alert"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

