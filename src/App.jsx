import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './storage'
import { scheduleReminder } from './reminder'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import NewPrayer from './pages/NewPrayer'
import PrayerDetail from './pages/PrayerDetail'
import Answered from './pages/Answered'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import NewGroup from './pages/NewGroup'
import JoinGroup from './pages/JoinGroup'
import Settings from './pages/Settings'

function RequireUser({ children }) {
  const user = getUser()
  if (!user) return <Navigate to="/onboard" replace />
  return children
}

export default function App() {
  useEffect(() => {
    scheduleReminder()
    const handler = () => scheduleReminder()
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return (
    <BrowserRouter basename="/pray">
      <Routes>
        <Route path="/onboard" element={<Onboarding />} />

        <Route path="/" element={
          <RequireUser>
            <Layout />
          </RequireUser>
        }>
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
