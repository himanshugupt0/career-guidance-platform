import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, Mail, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '../components/AuthLayout.jsx'
import api from '../api.js'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // email | otp | done
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function sendOtp(e) {
    e.preventDefault()
    setError('')
    if (!email) { setError('Enter your email.'); return }
    setSaving(true)
    try {
      await api.post('/auth/forgot/start', { email })
      setStep('otp')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP.')
    } finally { setSaving(false) }
  }

  async function resetPassword(e) {
    e.preventDefault()
    setError('')
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return }
    setSaving(true)
    try {
      await api.post('/auth/forgot/verify', { email, otp, newPassword })
      setStep('done')
    } catch (err) {
      setError(err?.response?.data?.message || 'OTP verification failed.')
    } finally { setSaving(false) }
  }

  if (step === 'done') {
    return (
      <AuthLayout title="Password reset!" footer={<Link className="font-bold text-indigo-600" to="/login">Back to Login</Link>}>
        <div className="text-center py-4">
          <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={48} />
          <p className="text-slate-600 dark:text-slate-300 mb-6">Your password has been reset successfully.</p>
          <button className="btn-primary w-full" onClick={() => navigate('/login')}>Login now</button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle={step === 'email' ? 'Enter your email to receive a reset OTP.' : `Enter the OTP sent to ${email} and set a new password.`}
      footer={<Link className="font-bold text-indigo-600" to="/login">Back to Login</Link>}
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />{error}
        </div>
      )}

      {step === 'email' ? (
        <form className="space-y-4" onSubmit={sendOtp}>
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Email</label>
            <input className="input mt-1" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" autoComplete="email" />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? <><Loader2 className="animate-spin" size={16} /> Sending…</> : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={resetPassword}>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200">
            OTP sent to <span className="font-bold">{email}</span>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">OTP</label>
            <input className="input mt-1 tracking-[0.35em]" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" type="text" inputMode="numeric" autoComplete="one-time-code" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">New Password</label>
            <div className="relative mt-1">
              <input className="input pr-10" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" type={showPassword ? 'text' : 'password'} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? <><Loader2 className="animate-spin" size={16} /> Resetting…</> : 'Reset Password'}
          </button>
          <button type="button" className="btn-ghost w-full" onClick={() => { setStep('email'); setOtp(''); setError('') }}>Change email</button>
        </form>
      )}
    </AuthLayout>
  )
}