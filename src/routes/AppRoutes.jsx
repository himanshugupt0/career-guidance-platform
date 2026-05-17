import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute.jsx'

import { Home } from '../pages/Home.jsx'
import { Login } from '../pages/Login.jsx'
import { Signup } from '../pages/Signup.jsx'
import { ForgotPassword } from '../pages/ForgotPassword.jsx'
import { DashboardLayout } from '../components/DashboardLayout.jsx'
import { DashboardHome } from '../pages/DashboardHome.jsx'
import { AptitudeTest } from '../pages/AptitudeTest.jsx'
import { Recommendations } from '../pages/Recommendations.jsx'
import { CollegeDirectory } from '../pages/CollegeDirectory.jsx'
import { Alerts } from '../pages/Alerts.jsx'
import { Profile } from '../pages/Profile.jsx'
import { NotFound } from '../pages/NotFound.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/test" element={<AptitudeTest />} />
          <Route path="/dashboard/recommendations" element={<Recommendations />} />
          <Route path="/dashboard/colleges" element={<CollegeDirectory />} />
          <Route path="/dashboard/alerts" element={<Alerts />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}