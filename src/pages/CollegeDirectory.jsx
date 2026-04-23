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
    async function detectLocation() {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        if (data?.region) {
          setState(data.region)
        }
      } catch {
        // ignore
      }
    }

    detectLocation()
  }, [])

  async function loadFavorites() {
    const auth = loadAuth()
    if (!auth?.token) {
      setFavorites([])
      setFavLoading(false)
      return
    }

    try {
      const res = await api.get('/favorites', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      setFavorites(res.data?.favorites || [])
    } catch {
      setFavorites([])
    } finally {
      setFavLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  const states = useMemo(() => {
    return ['All', ...new Set(colleges.map((c) => c.state))]
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()

    return colleges.filter((c) => {
      const matchTerm =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.courses.some((x) => x.toLowerCase().includes(term))

      const matchState = state === 'All' || c.state === state
      return matchTerm && matchState
    })
  }, [q, state])

  const favoriteIds = useMemo(() => {
    return new Set((favorites || []).map((f) => f.collegeId))
  }, [favorites])

  function isFavorite(collegeId) {
    return favoriteIds.has(collegeId)
  }

  async function toggleFavorite(college) {
    const auth = loadAuth()
    if (!auth?.token) {
      alert('Please log in first.')
      return
    }

    try {
      const res = await api.post(
        '/favorites/toggle',
        {
          college: {
            id: college.id,
            name: college.name,
            state: college.state,
            district: college.district,
            website: college.website,
            courses: college.courses,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )

      setFavorites(res.data?.favorites || [])
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update favorites.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Government College Directory"
        subtitle="Find colleges based on your location and interests."
      />

      {!favLoading && favorites.length > 0 ? (
        <div className="card mb-6 p-5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Saved Colleges
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((c) => (
              <div
                key={c.collegeId}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/30"
              >
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {c.name}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {c.district}, {c.state}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="card p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Search Colleges</label>
            <div className="mt-2 input">
              <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
              <input
                className="pl-10 w-full bg-transparent text-base outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, course, or location..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold">State</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2 bg-white/60 dark:bg-slate-900/60">
              <Filter size={18} className="text-slate-400" />
              <select
                className="w-full bg-transparent text-sm outline-none text-slate-900 dark:text-slate-100"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                {states.map((s) => (
                  <option key={s} value={s} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Showing <b>{filtered.length}</b> colleges
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : filtered.map((c) => {
              const liked = isFavorite(c.id)

              return (
                <div key={c.id} className="card p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {c.name}
                      </div>
                      <div className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-300">
                        {c.district}, {c.state}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(c)}
                      className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                        liked
                          ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300'
                          : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-500'
                      }`}
                      aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
                      title={liked ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="mt-4 text-xs font-bold uppercase text-slate-400">
                    Courses
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.courses.map((x) => (
                      <span
                        key={x}
                        className="rounded-full border px-3 py-1 text-xs font-bold"
                      >
                        {x}
                      </span>
                    ))}
                  </div>

                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-sm font-bold text-indigo-600"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              )
            })}
      </div>
    </div>
  )
}

