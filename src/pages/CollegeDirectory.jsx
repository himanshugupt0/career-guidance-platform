import { useEffect, useMemo, useState } from 'react'
import { Filter, Heart, Search } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { CardSkeleton } from '../components/Skeleton.jsx'
import { colleges } from '../data/colleges.js'
import api from '../api'
import { loadAuth } from '../routes/storage.js'

export function CollegeDirectory() {
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [state, setState] = useState('All')
  const [favorites, setFavorites] = useState([])
  const [favLoading, setFavLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => { if (d?.region) setState(d.region) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const auth = loadAuth()
    if (!auth?.token) { setFavLoading(false); return }
    api.get('/favorites', { headers: { Authorization: `Bearer ${auth.token}` } })
      .then(res => setFavorites(res.data?.favorites || []))
      .catch(() => setFavorites([]))
      .finally(() => setFavLoading(false))
  }, [])

  const states = useMemo(() => ['All', ...new Set(colleges.map(c => c.state))], [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return colleges.filter(c => {
      const matchTerm = !term || c.name.toLowerCase().includes(term) || c.courses.some(x => x.toLowerCase().includes(term))
      const matchState = state === 'All' || c.state === state
      return matchTerm && matchState
    })
  }, [q, state])

  const favoriteIds = useMemo(() => new Set((favorites || []).map(f => f.collegeId)), [favorites])

  async function toggleFavorite(college) {
    const auth = loadAuth()
    if (!auth?.token) { alert('Please log in first.'); return }
    try {
      const res = await api.post('/favorites/toggle',
        { college: { id: college.id, name: college.name, state: college.state, district: college.district, website: college.website, courses: college.courses } },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )
      setFavorites(res.data?.favorites || [])
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update favorites.')
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Government College Directory" subtitle="Find colleges based on your location and interests." />

      {/* Saved colleges */}
      {!favLoading && favorites.length > 0 && (
        <div className="card p-4 sm:p-5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Saved Colleges</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map(c => (
              <div key={c.collegeId} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/30">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{c.name}</div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{c.district}, {c.state}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              className="input pl-9 py-2.5 text-sm w-full"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by name or course..."
            />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/50 px-3 py-2 sm:w-48">
            <Filter size={15} className="text-slate-400 shrink-0" />
            <select
              className="w-full bg-transparent text-sm outline-none text-slate-900 dark:text-slate-100"
              value={state}
              onChange={e => setState(e.target.value)}
            >
              {states.map(s => (
                <option key={s} value={s} className="bg-white dark:bg-slate-900">{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Showing <b>{filtered.length}</b> colleges
        </div>
      </div>

      {/* College grid */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Search className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">No colleges found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Try a different search term or state.</p>
          </div>
        ) : (
          filtered.map(c => {
            const liked = favoriteIds.has(c.id)
            return (
              <div key={c.id} className="card p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{c.name}</div>
                    <div className="mt-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-300">{c.district}, {c.state}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(c)}
                    className={`shrink-0 grid h-9 w-9 place-items-center rounded-full border transition ${
                      liked
                        ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300'
                        : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 dark:border-slate-800 dark:bg-slate-950/30'
                    }`}
                    aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase text-slate-400 mb-1.5">Courses</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.courses.map(x => (
                      <span key={x} className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {x}
                      </span>
                    ))}
                  </div>
                </div>

                {c.website && (
                  <a href={c.website} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">
                    Visit Website →
                  </a>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}