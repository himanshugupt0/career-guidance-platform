/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import api from '../api'
import { clearAuth, loadAuth, saveAuth } from './storage.js'

const AuthContext = createContext(null)
const TEST_KEY = 'oscea_test_results'
const APTITUDE_KEY = 'aptitude_progress'
const STREAM_KEY = 'userStream'

function setAuthState(next, setAuth) {
  saveAuth(next)
  setAuth(next)
  return next
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth())

  const value = useMemo(() => {
    const user = auth?.user ?? null
    const token = auth?.token ?? null

    async function requestSignupOtp({ name, email, password }) {
      await api.post('/auth/signup/start', { name, email, password })
    }

    async function verifySignupOtp({ email, otp }) {
      const res = await api.post('/auth/signup/verify', { email, otp })
      setAuthState(res.data, setAuth)
      return res.data.user
    }

    async function requestLoginOtp({ email, password }) {
      await api.post('/auth/login/start', { email, password })
    }

    async function verifyLoginOtp({ email, otp }) {
      const res = await api.post('/auth/login/verify', { email, otp })
      // Clear any previous user's test data on fresh login
      localStorage.removeItem(TEST_KEY)
      localStorage.removeItem(APTITUDE_KEY)
      localStorage.removeItem(STREAM_KEY)
      setAuthState(res.data, setAuth)
      // Load test result from DB if exists
      if (res.data.user?.testResult?.streamHint) {
        localStorage.setItem(TEST_KEY, JSON.stringify(res.data.user.testResult))
        localStorage.setItem(STREAM_KEY, res.data.user.testResult.streamHint)
      }
      return res.data.user
    }

    async function updateProfile(patch) {
      try {
        const res = await api.put('/me', patch)
        const updated = res.data.user
        const next = { token: token || '', user: { ...(user || {}), ...updated } }
        saveAuth(next)
        setAuth(next)
        return updated
      } catch (err) {
        // Fallback: save locally if API fails
        const next = { token: token || '', user: { ...(user || {}), ...patch } }
        saveAuth(next)
        setAuth(next)
        throw err
      }
    }

    return {
      user,
      token,
      isAuthed: Boolean(user && token),

      requestSignupOtp,
      verifySignupOtp,
      requestLoginOtp,
      verifyLoginOtp,

      // backward-compatible aliases
      signup: requestSignupOtp,
      login: requestLoginOtp,

      logout() {
        // Clear ALL user-specific localStorage on logout
        clearAuth()
        localStorage.removeItem(TEST_KEY)
        localStorage.removeItem(APTITUDE_KEY)
        localStorage.removeItem(STREAM_KEY)
        setAuth(null)
      },

      updateProfile,

      // Sync user data from DB (call after login)
      async refreshUser() {
        try {
          const res = await api.get('/me')
          const updated = res.data.user
          const next = { token: token || '', user: updated }
          saveAuth(next)
          setAuth(next)
          if (updated?.testResult?.streamHint) {
            localStorage.setItem(TEST_KEY, JSON.stringify(updated.testResult))
            localStorage.setItem(STREAM_KEY, updated.testResult.streamHint)
          }
          return updated
        } catch {
          return null
        }
      },
    }
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}