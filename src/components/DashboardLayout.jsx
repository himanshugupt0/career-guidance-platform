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
        {/* Sidebar — hidden on mobile, visible on lg+ */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1 px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-6">
          <Outlet />
        </main>
      </div>
      <MobileSidebar open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
