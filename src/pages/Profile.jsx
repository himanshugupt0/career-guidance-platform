import api from '../api.js'
import { useMemo, useState } from 'react'
import { Save, User2, CheckCircle2, AlertCircle } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

const GRADES = ['Class 10', 'Class 12']
const STREAMS = ['Science', 'Commerce', 'Arts', 'Not decided yet']
const BUDGETS = [
  { value: 'low', label: 'Low — Govt colleges only' },
  { value: 'medium', label: 'Medium — Govt + some private' },
  { value: 'high', label: 'High — Any college' },
]
const INTERESTS = ['Engineering', 'Medical', 'Law', 'Commerce', 'Design', 'Arts', 'Teaching', 'Government Jobs', 'Not sure yet']
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

export function Profile() {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  const initial = useMemo(() => ({
    name: user?.name || '',
    grade: user?.grade || 'Class 12',
    state: user?.state || '',
    budget: user?.budget || 'low',
    marks: user?.marks || '',
    stream: user?.stream || '',
    careerInterest: user?.careerInterest || '',
  }), [user])

  const [form, setForm] = useState(initial)
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  async function onSave() {
    setSaving(true)
    setStatus(null)
    try {
      await updateProfile(form)
      if (form.currentPassword && form.newPassword) {
      await api.post('/auth/change-password', { currentPassword: form.currentPassword, newPassword: form.newPassword })
      }
      setStatus('success')
      setEditing(false)
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  function onEdit() {
    setForm(initial)
    setStatus(null)
    setEditing(true)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Your details help us give accurate college and career recommendations."
        right={
          !editing && (
            <button type="button" className="btn-primary py-2 px-4 text-sm" onClick={onEdit}>
              Edit profile
            </button>
          )
        }
      />

      {status === 'success' && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 size={16} /> Profile saved successfully.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle size={16} /> Failed to save. Check your connection.
        </div>
      )}

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        {/* Summary */}
        <div className="card p-5">
          <div className="flex items-start gap-3 mb-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
              <User2 size={19} />
            </div>
            <div className="min-w-0">
              <div className="truncate font-extrabold text-slate-900 dark:text-white">{user?.name || 'Student'}</div>
              <div className="truncate text-xs text-slate-600 dark:text-slate-300">{user?.email || '—'}</div>
            </div>
          </div>
          <div className="grid gap-2 text-sm">
            {[
              { label: 'Class', value: user?.grade || '—' },
              { label: 'Stream', value: user?.stream || '—' },
              { label: 'State', value: user?.state || '—' },
              { label: 'Marks', value: user?.marks || '—' },
              { label: 'Budget', value: user?.budget || '—' },
              { label: 'Interest', value: user?.careerInterest || '—' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/30 px-3 py-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[120px] capitalize">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card p-5 lg:col-span-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-5">
            {editing ? 'Edit your details' : 'Your details'}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Full Name</label>
              <input className="input mt-1 py-2.5 text-sm" value={editing ? form.name : initial.name} onChange={e => set('name', e.target.value)} disabled={!editing} />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Email (cannot be changed)</label>
              <input className="input mt-1 py-2.5 text-sm opacity-60" value={user?.email || ''} disabled />
            </div>

            <div>
              <label className="label">Class</label>
              <select className="input mt-1 py-2.5 text-sm" value={editing ? form.grade : initial.grade} onChange={e => set('grade', e.target.value)} disabled={!editing}>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Stream</label>
              <select className="input mt-1 py-2.5 text-sm" value={editing ? form.stream : initial.stream} onChange={e => set('stream', e.target.value)} disabled={!editing}>
                <option value="">Select stream</option>
                {STREAMS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* STATE DROPDOWN — fixed */}
            <div>
              <label className="label">State</label>
              <select className="input mt-1 py-2.5 text-sm" value={editing ? form.state : initial.state} onChange={e => set('state', e.target.value)} disabled={!editing}>
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Marks / Percentage</label>
              <input className="input mt-1 py-2.5 text-sm" placeholder="e.g. 85%" value={editing ? form.marks : initial.marks} onChange={e => set('marks', e.target.value)} disabled={!editing} />
            </div>

            <div className="sm:col-span-2">
              <label className="label">College Budget</label>
              <select className="input mt-1 py-2.5 text-sm" value={editing ? form.budget : initial.budget} onChange={e => set('budget', e.target.value)} disabled={!editing}>
                {BUDGETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="label">Career Interest</label>
              <select className="input mt-1 py-2.5 text-sm" value={editing ? form.careerInterest : initial.careerInterest} onChange={e => set('careerInterest', e.target.value)} disabled={!editing}>
                <option value="">Select interest</option>
                {INTERESTS.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>

            {/* Change Password section */}
{editing && (
  <div className="sm:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Change Password (optional)</div>
    <div className="grid gap-3 sm:grid-cols-2">
      <input className="input py-2.5 text-sm" type="password" placeholder="Current password" value={form.currentPassword || ''} onChange={e => set('currentPassword', e.target.value)} />
      <input className="input py-2.5 text-sm" type="password" placeholder="New password (min 6)" value={form.newPassword || ''} onChange={e => set('newPassword', e.target.value)} />
    </div>
  </div>
)}
          {editing && (
            <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-slate-100 dark:border-slate-800 pt-5">
              <button type="button" className="btn-ghost py-2.5 text-sm" onClick={() => { setEditing(false); setStatus(null) }}>Cancel</button>
              <button type="button" className="btn-primary py-2.5 text-sm" onClick={onSave} disabled={saving}>
                {saving ? 'Saving...' : <><Save size={15} /> Save changes</>}
              </button>
            </div>
          )}

          {!editing && (
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              These details are used to personalize your college and career recommendations.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}