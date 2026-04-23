import {
  Bell,
  BookOpen,
  Compass,
  LayoutDashboard,
  Target,
  User,
} from 'lucide-react'

export const sidebarNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/test', label: 'Aptitude Test', icon: Target },
  { to: '/dashboard/recommendations', label: 'Recommendations', icon: Compass },
  { to: '/dashboard/colleges', label: 'College Directory', icon: BookOpen },
  { to: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

