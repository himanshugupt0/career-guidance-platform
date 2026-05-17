const SibApiV3Sdk = require('sib-api-v3-sdk')
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors({
  origin: [
    'https://careerguidanceplatf.netlify.app',
    'http://localhost:5173',
    'https://career-guidance-platform-6djn.onrender.com/',
  ],
  credentials: true,
}))
app.use(express.json())

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET env variable is not set.')
  process.exit(1)
}

// ─── OTP Store (in-memory) ────────────────────────────────────────────────────
const signupOtpStore = new Map()
const loginOtpStore = new Map()

// ─── Helpers ──────────────────────────────────────────────────────────────────
const disposableDomains = ['mailinator.com','10minutemail.com','guerrillamail.com','yopmail.com','tempmail.com','throwawaymail.com','maildrop.cc']

function normalizeEmail(email = '') { return String(email).trim().toLowerCase() }
function generateOtp() { return Math.floor(100000 + Math.random() * 900000).toString() }
function isDisposableEmail(email = '') { return disposableDomains.includes(normalizeEmail(email).split('@')[1] || '') }

function sanitizeUser(user) {
  if (!user) return null
  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    email: user.email,
    grade: user.grade || '',
    state: user.state || '',
    budget: user.budget || '',
    marks: user.marks || '',
    stream: user.stream || '',
    careerInterest: user.careerInterest || '',
    testResult: user.testResult || null,
    favoriteColleges: user.favoriteColleges || [],
    createdAt: user.createdAt || null,
  }
}

async function sendMail({ to, subject, text }) {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance
    defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY
    const api = new SibApiV3Sdk.TransactionalEmailsApi()
    await api.sendTransacEmail({
      sender: { email: process.env.EMAIL_USER, name: 'One Stop Advisor' },
      to: [{ email: to }],
      subject,
      htmlContent: `<div style="font-family:Arial,sans-serif;padding:20px;"><h2>${subject}</h2><p>${text}</p></div>`,
    })
  } catch (err) {
    console.error('Email error:', err?.message || err)
    throw err
  }
}

// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB error:', err.message); process.exit(1) })

// ─── Schemas ──────────────────────────────────────────────────────────────────
const FavoriteCollegeSchema = new mongoose.Schema({
  collegeId: { type: String, required: true },
  name: String,
  state: String,
  district: String,
  website: String,
  courses: [String],
}, { _id: false })

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: String,
  collegeName: String,
  title: String,
  description: String,
  type: { type: String, enum: ['admission', 'scholarship', 'exam', 'result'], required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  // ── Profile fields ──
  grade: { type: String, default: '' },        // 'Class 10' | 'Class 12'
  state: { type: String, default: '' },        // e.g. 'Uttar Pradesh'
  budget: { type: String, default: '' },       // 'low' | 'medium' | 'high'
  marks: { type: String, default: '' },        // e.g. '85%'
  stream: { type: String, default: '' },       // 'Science' | 'Commerce' | 'Arts'
  careerInterest: { type: String, default: '' },
  // ── Test result ──
  testResult: {
    streamHint: String,
    profile: String,
    reason: String,
    scores: { type: Map, of: Number },
    takenAt: { type: Date },
  },
  favoriteColleges: { type: [FavoriteCollegeSchema], default: [] },
  alerts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }],
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false })

const User = mongoose.model('User', UserSchema)
const Alert = mongoose.model('Alert', AlertSchema)

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided.' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ ok: true }))

// Signup
app.post('/auth/signup/start', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const safeEmail = normalizeEmail(email)

    if (!name || !safeEmail || !password) return res.status(400).json({ message: 'All fields required.' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    if (isDisposableEmail(safeEmail)) return res.status(400).json({ message: 'Disposable emails not allowed.' })
    if (await User.findOne({ email: safeEmail })) return res.status(400).json({ message: 'Account already exists.' })

    const otp = generateOtp()
    signupOtpStore.set(safeEmail, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      payload: { name: String(name).trim(), email: safeEmail, password },
    })

    await sendMail({ to: safeEmail, subject: 'Verify your account', text: `Your OTP is <b>${otp}</b>. Expires in 5 minutes.` })
    return res.json({ message: 'OTP sent.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to send OTP.' })
  }
})

app.post('/auth/signup/verify', async (req, res) => {
  try {
    const { email, otp } = req.body
    const safeEmail = normalizeEmail(email)
    const record = signupOtpStore.get(safeEmail)

    if (!record) return res.status(400).json({ message: 'OTP expired. Request a new one.' })
    if (Date.now() > record.expiresAt) { signupOtpStore.delete(safeEmail); return res.status(400).json({ message: 'OTP expired.' }) }
    if (String(record.otp) !== String(otp).trim()) return res.status(400).json({ message: 'Invalid OTP.' })
    if (await User.findOne({ email: safeEmail })) { signupOtpStore.delete(safeEmail); return res.status(400).json({ message: 'Account already exists.' }) }

    const hashedPassword = await bcrypt.hash(record.payload.password, 10)
    const user = await User.create({ name: record.payload.name, email: safeEmail, password: hashedPassword })
    signupOtpStore.delete(safeEmail)

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({ message: 'Account created.', token, user: sanitizeUser(user) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Signup failed.' })
  }
})

// Login
app.post('/auth/login/start', async (req, res) => {
  try {
    const { email, password } = req.body
    const safeEmail = normalizeEmail(email)

    if (!safeEmail || !password) return res.status(400).json({ message: 'Email and password required.' })

    const user = await User.findOne({ email: safeEmail })
    if (!user) return res.status(401).json({ message: 'User not found.' })
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Invalid password.' })

    const otp = generateOtp()
    loginOtpStore.set(safeEmail, { otp, expiresAt: Date.now() + 5 * 60 * 1000 })

    await sendMail({ to: safeEmail, subject: 'Your login OTP', text: `Your OTP is <b>${otp}</b>. Expires in 5 minutes.` })
    return res.json({ message: 'OTP sent.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Login failed.' })
  }
})

app.post('/auth/login/verify', async (req, res) => {
  try {
    const { email, otp } = req.body
    const safeEmail = normalizeEmail(email)
    const record = loginOtpStore.get(safeEmail)

    if (!record) return res.status(400).json({ message: 'OTP expired. Request a new one.' })
    if (Date.now() > record.expiresAt) { loginOtpStore.delete(safeEmail); return res.status(400).json({ message: 'OTP expired.' }) }
    if (String(record.otp) !== String(otp).trim()) return res.status(400).json({ message: 'Invalid OTP.' })

    const user = await User.findOne({ email: safeEmail })
    if (!user) { loginOtpStore.delete(safeEmail); return res.status(404).json({ message: 'User not found.' }) }
    loginOtpStore.delete(safeEmail)

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({ message: 'Login successful.', token, user: sanitizeUser(user) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Login verification failed.' })
  }
})

// Get current user
app.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json({ user: sanitizeUser(user) })
})

// Update profile — NEW ROUTE
app.put('/me', authMiddleware, async (req, res) => {
  try {
    const allowed = ['name', 'grade', 'state', 'budget', 'marks', 'stream', 'careerInterest']
    const patch = {}
    allowed.forEach(key => { if (req.body[key] !== undefined) patch[key] = req.body[key] })

    const user = await User.findByIdAndUpdate(req.user.id, patch, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json({ user: sanitizeUser(user) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Profile update failed.' })
  }
})

// Submit aptitude test — saves to DB per user
app.post('/submit-test', authMiddleware, async (req, res) => {
  try {
    const { streamHint, profile, reason, scores } = req.body
    if (!streamHint) return res.status(400).json({ message: 'streamHint is required.' })

    const testResult = { streamHint, profile, reason, scores, takenAt: new Date() }
    const user = await User.findByIdAndUpdate(req.user.id, { testResult, stream: streamHint }, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found.' })

    return res.json({ message: 'Test result saved.', user: sanitizeUser(user) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to save test result.' })
  }
})

// Favorites
app.get('/favorites', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate('alerts')
  if (!user) return res.status(404).json({ message: 'User not found.' })
  return res.json({
    favorites: user.favoriteColleges || [],
    unreadCount: (user.alerts || []).filter(a => !a.read).length,
  })
})

app.post('/favorites/toggle', authMiddleware, async (req, res) => {
  try {
    const { college } = req.body
    if (!college?.id) return res.status(400).json({ message: 'College data required.' })

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    const exists = (user.favoriteColleges || []).some(item => item.collegeId === college.id)

    if (exists) {
      user.favoriteColleges = user.favoriteColleges.filter(item => item.collegeId !== college.id)
      const alert = await Alert.create({
        userId: user._id, collegeId: college.id, collegeName: college.name,
        title: `Removed ${college.name} from favorites`,
        description: `You removed "${college.name}". You will no longer receive updates for this college.`,
        type: 'result',
      })
      user.alerts.push(alert._id)
      sendMail({ to: user.email, subject: `Removed: ${college.name}`, text: `Hi ${user.name}, you removed "${college.name}" from favorites.` }).catch(console.error)
    } else {
      user.favoriteColleges.push({ collegeId: college.id, name: college.name, state: college.state, district: college.district, website: college.website || '', courses: college.courses || [] })
      const alert = await Alert.create({
        userId: user._id, collegeId: college.id, collegeName: college.name,
        title: `Added ${college.name} to favorites`,
        description: `You will now receive updates for ${college.name}.`,
        type: 'admission',
      })
      user.alerts.push(alert._id)
      sendMail({ to: user.email, subject: `Added: ${college.name}`, text: `Hi ${user.name}, you added "${college.name}" to favorites.` }).catch(console.error)
    }

    await user.save()
    return res.json({ favorites: user.favoriteColleges, unreadCount: user.alerts?.length || 0 })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to update favorites.' })
  }
})

// Alerts
app.get('/alerts', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('alerts')
    const alerts = user?.alerts || []
    res.json({ alerts, unreadCount: alerts.filter(a => !a.read).length, favorites: user?.favoriteColleges || [] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch alerts.' })
  }
})

app.post('/alerts/read', authMiddleware, async (req, res) => {
  try {
    const { alertIds } = req.body
    if (!alertIds?.length) return res.json({ success: true })
    // Fixed: using updateMany instead of forEach with async
    await Alert.updateMany({ _id: { $in: alertIds }, userId: req.user.id }, { $set: { read: true } })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to mark as read.' })
  }
})

app.delete('/alerts/:id', authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!alert) return res.status(404).json({ message: 'Alert not found.' })
    await User.findByIdAndUpdate(req.user.id, { $pull: { alerts: req.params.id } })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete alert.' })
  }
})

// Forgot password — send OTP
const forgotOtpStore = new Map()

app.post('/auth/forgot/start', async (req, res) => {
  try {
    const safeEmail = normalizeEmail(req.body.email)
    const user = await User.findOne({ email: safeEmail })
    if (!user) return res.status(404).json({ message: 'No account found with this email.' })
    const otp = generateOtp()
    forgotOtpStore.set(safeEmail, { otp, expiresAt: Date.now() + 5 * 60 * 1000 })
    await sendMail({ to: safeEmail, subject: 'Password Reset OTP', text: `Your password reset OTP is <b>${otp}</b>. Expires in 5 minutes.` })
    res.json({ message: 'OTP sent.' })
  } catch { res.status(500).json({ message: 'Failed to send OTP.' }) }
})

app.post('/auth/forgot/verify', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    const safeEmail = normalizeEmail(email)
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    const record = forgotOtpStore.get(safeEmail)
    if (!record) return res.status(400).json({ message: 'OTP expired. Request a new one.' })
    if (Date.now() > record.expiresAt) { forgotOtpStore.delete(safeEmail); return res.status(400).json({ message: 'OTP expired.' }) }
    if (String(record.otp) !== String(otp).trim()) return res.status(400).json({ message: 'Invalid OTP.' })
    const hashed = await bcrypt.hash(newPassword, 10)
    await User.findOneAndUpdate({ email: safeEmail }, { password: hashed })
    forgotOtpStore.delete(safeEmail)
    res.json({ message: 'Password reset successful.' })
  } catch { res.status(500).json({ message: 'Password reset failed.' }) }
})

// Change password (logged in user)
app.post('/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters.' })
    const user = await User.findById(req.user.id)
    if (!await bcrypt.compare(currentPassword, user.password)) return res.status(401).json({ message: 'Current password is incorrect.' })
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ message: 'Password changed successfully.' })
  } catch { res.status(500).json({ message: 'Failed to change password.' }) }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
