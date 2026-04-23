import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from './Sidebar.jsx'
import { MobileSidebar } from './MobileSidebar.jsx'
import { Topbar } from './Topbar.jsx'

export function DashboardLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Topbar onOpenMenu={() => setOpen(true)} />
      <div className="mx-auto flex w-full max-w-7xl">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <MobileSidebar open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

