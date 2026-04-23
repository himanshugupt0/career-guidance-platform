import { useMemo, useState } from 'react'
import { Save, User2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

export function Profile() {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)

  const initial = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      grade: user?.grade || 'Class 12',
      location: user?.location || 'India',
    }),
    [user],
  )

  const [form, setForm] = useState(initial)

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function onSave() {
    updateProfile({
      name: form.name,
      grade: form.grade,
      location: form.location,
    })
    setEditing(false)
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Update your basic details to personalize the experience."
        right={
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setForm(initial)
              setEditing((e) => !e)
            }}
          >
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
              <User2 size={20} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-extrabold text-slate-900 dark:text-white">
                {user?.name || 'Student'}
              </div>
              <div className="truncate text-sm text-slate-600 dark:text-slate-300">
                {user?.email || '—'}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/30">
              <span className="text-slate-500 dark:text-slate-400">Class</span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {user?.grade || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/30">
              <span className="text-slate-500 dark:text-slate-400">Location</span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {user?.location || '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {editing ? 'Edit details' : 'Details'}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Name
              </label>
              <input
                className="input mt-1"
                value={editing ? form.name : initial.name}
                onChange={(e) => setField('name', e.target.value)}
                disabled={!editing}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Email (read-only)
              </label>
              <input className="input mt-1" value={initial.email} disabled />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Class
              </label>
              <select
                className="input mt-1"
                value={editing ? form.grade : initial.grade}
                onChange={(e) => setField('grade', e.target.value)}
                disabled={!editing}
              >
                <option>Class 10</option>
                <option>Class 12</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Location
              </label>
              <input
                className="input mt-1"
                value={editing ? form.location : initial.location}
                onChange={(e) => setField('location', e.target.value)}
                disabled={!editing}
              />
            </div>
          </div>

          {editing ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" className="btn-primary" onClick={onSave}>
                <Save size={16} />
                Save changes
              </button>
            </div>
          ) : (
            <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
              Click <b>Edit profile</b> to update your details.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

