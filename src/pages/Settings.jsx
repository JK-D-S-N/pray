import { useState } from 'react'
import { Bell, BellOff, Download, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getUser, updateUser, getReminderTime, setReminderTime, exportData, getPrayers } from '../storage'
import { useStorage } from '../hooks/useStorage'
import Avatar from '../components/Avatar'

const field = 'border border-rim bg-bg text-t1 px-3 py-2 text-sm focus:outline-none focus:border-gold'

export default function Settings() {
  const [user, refreshUser] = useStorage(getUser)
  const [reminderTime, refreshReminder] = useStorage(getReminderTime)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [notifStatus, setNotifStatus] = useState(Notification.permission)
  const [prayers] = useStorage(getPrayers)

  const activeCount = prayers.filter(p => p.status === 'active').length
  const answeredCount = prayers.filter(p => p.status === 'answered').length

  function saveName(e) {
    e.preventDefault()
    if (!nameInput.trim()) return
    updateUser({ name: nameInput })
    setEditingName(false)
    refreshUser()
  }

  async function handleToggleReminder() {
    if (reminderTime) {
      setReminderTime(null)
      refreshReminder()
      return
    }
    if (notifStatus === 'denied') {
      alert('Notifications are blocked. Allow them in your browser settings.')
      return
    }
    const perm = await Notification.requestPermission()
    setNotifStatus(perm)
    if (perm === 'granted') {
      setReminderTime('08:00')
      refreshReminder()
    }
  }

  function handleTimeChange(e) {
    setReminderTime(e.target.value)
    refreshReminder()
  }

  function handleExport() {
    const data = exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sounding-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) return null

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-semibold text-t1 tracking-tight mb-6">Settings</h1>

      {/* Profile */}
      <section className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-3">Profile</p>
        <div className="border border-rim bg-surface p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar initials={user.avatarInitials} size="lg" />
            <div>
              <p className="font-medium text-t1 tracking-tight">{user.name}</p>
              <p className="font-mono text-[11px] text-t3">{activeCount} active prayer{activeCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {editingName ? (
            <form onSubmit={saveName} className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                autoFocus
                className={`flex-1 ${field}`}
              />
              <button type="button" onClick={() => setEditingName(false)} className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-t3 border border-rim hover:border-rim-hi">
                Cancel
              </button>
              <button type="submit" disabled={!nameInput.trim()} className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest bg-gold text-bg disabled:opacity-30 hover:brightness-110">
                Save
              </button>
            </form>
          ) : (
            <button
              onClick={() => { setNameInput(user.name); setEditingName(true) }}
              className="font-mono text-[11px] uppercase tracking-widest text-gold hover:brightness-110 transition-all"
            >
              Edit name
            </button>
          )}
        </div>
      </section>

      {/* Reminders */}
      <section className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-3">Reminders</p>
        <div className="border border-rim bg-surface divide-y divide-rim">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {reminderTime
                ? <Bell className="w-4 h-4 text-gold" />
                : <BellOff className="w-4 h-4 text-t3" />
              }
              <div>
                <p className="text-sm text-t1">Daily reminder</p>
                <p className="font-mono text-[10px] text-t3 mt-0.5">Only works while tab is open</p>
              </div>
            </div>
            <button
              onClick={handleToggleReminder}
              className={`relative inline-flex h-5 w-9 items-center transition-colors ${reminderTime ? 'bg-gold' : 'bg-rim-hi'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform bg-bg transition-transform ${reminderTime ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {reminderTime && (
            <div className="p-4 flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-widest text-t3">Time</label>
              <input type="time" value={reminderTime} onChange={handleTimeChange} className={field} />
            </div>
          )}
        </div>
      </section>

      {/* Answered prayers */}
      <section className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-3">History</p>
        <Link
          to="/answered"
          className="w-full flex items-center justify-between border border-rim bg-surface px-4 py-3 hover:border-rim-hi transition-colors"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-t2">Answered prayers</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-t3">{answeredCount}</span>
            <ChevronRight className="w-3.5 h-3.5 text-t3" />
          </div>
        </Link>
      </section>

      {/* Data */}
      <section>
        <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-3">Data</p>
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 border border-rim bg-surface px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-t3 hover:border-rim-hi hover:text-t2 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export all data
        </button>
      </section>
    </div>
  )
}
