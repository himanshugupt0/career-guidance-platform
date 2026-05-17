import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, GraduationCap, Landmark, Heart, Trash2, CheckCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader.jsx'
import { CardSkeleton } from '../components/Skeleton.jsx'
import api from '../api.js'
import { sampleCollegeAlerts } from '../data/sampleCollegeAlerts.js'

const iconByType = { admission: GraduationCap, scholarship: Bell, exam: Landmark, result: Heart }

export function Alerts() {
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    api.get('/alerts')
      .then(res => { setAlerts(res.data.alerts || []); setLoading(false) })
      .catch(() => {
        setAlerts(sampleCollegeAlerts.map((a, i) => ({ ...a, id: `demo-${i}`, read: false })))
        setLoading(false)
      })
  }, [])

  const grouped = useMemo(() => {
    const out = {}
    alerts.forEach(a => { out[a.type] = out[a.type] || []; out[a.type].push(a) })
    return out
  }, [alerts])

  async function markRead(alertId) {
    try {
      await api.post('/alerts/read', { alertIds: [alertId] })
      setAlerts(prev => prev.map(a => (a.id === alertId || a._id === alertId) ? { ...a, read: true } : a))
    } catch {}
  }

  async function markAllRead() {
    const unreadIds = alerts.filter(a => !a.read).map(a => a.id || a._id?.toString())
    if (!unreadIds.length) return
    try {
      await api.post('/alerts/read', { alertIds: unreadIds })
      setAlerts(prev => prev.map(a => ({ ...a, read: true })))
    } catch {}
  }

  async function deleteAlert(alertId) {
    try {
      await api.delete(`/alerts/${alertId}`)
      setAlerts(prev => prev.filter(a => a.id !== alertId && a._id !== alertId))
    } catch {}
  }

  const unreadCount = alerts.filter(a => !a.read).length

  if (loading) {
    return (
      <div className="space-y-5">
        <PageHeader title="Alerts & Notifications" subtitle="Loading..." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title="Alerts & Notifications"
        subtitle={`${unreadCount} unread`}
        right={
          unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-ghost text-sm py-2 px-3 flex items-center gap-1.5">
              <CheckCheck size={15} /> Mark all read
            </button>
          )
        }
      />

      {alerts.length === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <Bell className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No alerts yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Add colleges to favorites to receive personalized updates.
          </p>
          <Link to="/dashboard/colleges" className="btn-primary">Find Colleges</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => {
            const Icon = iconByType[type] || Bell
            return (
              <section key={type}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white capitalize">{type}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{items.length} notification{items.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map(a => {
                    const alertId = a.id || a._id?.toString()
                    return (
                      <motion.div key={alertId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        className={`card p-4 sm:p-5 relative border-l-4 ${!a.read ? 'border-primary-500' : 'border-slate-200/50 dark:border-slate-800/50'}`}>
                        {!a.read && <span className="absolute top-3 right-3 bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">New</span>}
                        <div className="pr-10 mb-2">
                          <div className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">{a.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{a.date || (a.createdAt && new Date(a.createdAt).toLocaleDateString())}</div>
                        </div>
                        {a.collegeName && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                            <Heart size={12} className="text-rose-400 shrink-0" /><span className="truncate">{a.collegeName}</span>
                          </div>
                        )}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{a.description}</p>
                        <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <button type="button" onClick={() => markRead(alertId)} disabled={a.read}
                            className="flex-1 text-xs font-semibold py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 text-slate-600 dark:text-slate-300">
                            {a.read ? '✓ Read' : 'Mark read'}
                          </button>
                          <button type="button" onClick={() => deleteAlert(alertId)} aria-label="Delete"
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all">
                            <Trash2 size={14} />
                          </button>
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