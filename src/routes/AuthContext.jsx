/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import api from '../api'
import { clearAuth, loadAuth, saveAuth } from './storage.js'

const AuthContext = createContext(null)

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
      setAuthState(res.data, setAuth)
      return res.data.user
    }

    return {
      user,
      token,
      isAuthed: Boolean(user && token),

      // new OTP flow
      requestSignupOtp,
      verifySignupOtp,
      requestLoginOtp,
      verifyLoginOtp,

      // backward-compatible aliases
      signup: requestSignupOtp,
      login: requestLoginOtp,

      logout() {
        clearAuth()
        setAuth(null)
      },

      updateProfile(patch) {
        const next = {
          token: token || auth?.token || '',
          user: { ...(user || {}), ...patch },
        }
        saveAuth(next)
        setAuth(next)
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