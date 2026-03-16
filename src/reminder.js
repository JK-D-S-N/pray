import { getReminderTime, getPrayers } from './storage'

let reminderTimeout = null

export function scheduleReminder() {
  if (reminderTimeout) {
    clearTimeout(reminderTimeout)
    reminderTimeout = null
  }

  if (Notification.permission !== 'granted') return

  const time = getReminderTime()
  if (!time) return

  const [hours, minutes] = time.split(':').map(Number)
  const now = new Date()
  const next = new Date(now)
  next.setHours(hours, minutes, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)

  const ms = next - now

  reminderTimeout = setTimeout(() => {
    const active = getPrayers().filter(p => p.status === 'active')
    new Notification('sounding', {
      body: `You have ${active.length} active prayer${active.length !== 1 ? 's' : ''}.`,
      icon: '/pray/icon.png',
    })
    // Re-schedule for next day
    scheduleReminder()
  }, ms)
}
