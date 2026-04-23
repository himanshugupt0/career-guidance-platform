import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './routes/AuthContext.jsx'
import { ThemeProvider } from './routes/ThemeContext.jsx'
import { motion } from 'framer-motion'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="shimmer h-12 w-12 rounded-2xl animate-spin" />
            </div>
          }>
            <App />
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
