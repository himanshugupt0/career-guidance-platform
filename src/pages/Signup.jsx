import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, Mail, Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout.jsx'
import { useAuth } from '../routes/AuthContext.jsx'

export function Signup() {
  const navigate = useNavigate()
  const { requestSignupOtp, verifySignupOtp } = useAuth()

  const [step, setStep] = useState('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [lockedEmail, setLockedEmail] = useState('')

  async function sendOtp(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!name || !email || !password) { setError('All fields are required.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setSaving(true)
    try {
      await requestSignupOtp({ name, email, password })
      setLockedEmail(email)
      setStep('otp')
      setInfo(`OTP sent to ${email}.`)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to send OTP.')
    } finally { setSaving(false) }
  }

  async function verifyAndCreate(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await verifySignupOtp({ email: lockedEmail || email, otp })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'OTP verification failed.')
    } finally { setSaving(false) }
  }

  function changeEmail() {
    setStep('details')
    setOtp('')
    setInfo('')
    setError('')
    setLockedEmail('')
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Verify your email first, then create your account."
      footer={<>Already have an account? <Link className="font-bold text-indigo-600" to="/login">Login</Link></>}
    >
      {info && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-300">
          <Mail size={18} className="mt-0.5 shrink-0" /><div>{info}</div>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div><div className="font-extrabold">Couldn't create account</div><div className="mt-0.5">{error}</div></div>
        </div>
      )}

      {step === 'details' ? (
        <form className="space-y-4" onSubmit={sendOtp}>
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Name</label>
            <input className="input mt-1" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" type="text" autoComplete="name" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Email</label>
            <input className="input mt-1" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" autoComplete="email" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Password</label>
            <div className="relative mt-1">
              <input
                className="input pr-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? <><Loader2 className="animate-spin" size={16} /> Sending OTP…</> : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={verifyAndCreate}>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200">
            OTP sent to <span className="font-bold">{lockedEmail}</span>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">OTP</label>
            <input className="input mt-1 tracking-[0.35em]" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" type="text" inputMode="numeric" autoComplete="one-time-code" />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? <><Loader2 className="animate-spin" size={16} /> Verifying…</> : 'Verify & Create Account'}
          </button>
          <button type="button" className="btn-ghost w-full" onClick={changeEmail}>Change email</button>
        </form>
      )}
    </AuthLayout>
  )
}