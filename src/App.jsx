import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { scheduleReminder } from './reminder'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import AuthCallback from './pages/AuthCallback'
import Home from './pages/Home'
import NewPrayer from './pages/NewPrayer'
import PrayerDetail from './pages/PrayerDetail'
import Answered from './pages/Answered'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import NewGroup from './pages/NewGroup'
import JoinGroup from './pages/JoinGroup'
import Settings from './pages/Settings'

function LoadingScreen() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg">
      <p className="font-mono text-[11px] uppercase tracking-widest text-t3">Loading…</p>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    scheduleReminder()
    const handler = () => scheduleReminder()
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const session = useAuth()

  if (session === undefined) return <LoadingScreen />

  return (
    <BrowserRouter basename="/pray">
      <Routes>
        <Route
          path="/onboard"
          element={session ? <Navigate to="/" replace /> : <Onboarding />}
        />

        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          path="/"
          element={session ? <Layout /> : <Navigate to="/onboard" replace />}
        >
          <Route index element={<Home />} />
          <Route path="new" element={<NewPrayer />} />
          <Route path="prayer/:id" element={<PrayerDetail />} />
          <Route path="answered" element={<Answered />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/new" element={<NewGroup />} />
          <Route path="groups/join" element={<JoinGroup />} />
          <Route path="groups/:id" element={<GroupDetail />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
