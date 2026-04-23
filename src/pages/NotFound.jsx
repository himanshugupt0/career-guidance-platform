import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '../components/Navbar.jsx'

export function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <div className="container-page py-16">
        <div className="card p-10 text-left">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            404
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Page not found
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            The page you’re looking for doesn’t exist (or moved).
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="btn-primary">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <Link to="/dashboard" className="btn-ghost">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

