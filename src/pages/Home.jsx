import { getPrayers } from '../storage'
import { useStorage } from '../hooks/useStorage'
import PrayerCard from '../components/PrayerCard'
import EmptyState from '../components/EmptyState'

export default function Home() {
  const [prayers] = useStorage(getPrayers)
  const active = prayers.filter(p => p.status === 'active')

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-xl font-semibold text-t1 tracking-tight">Prayers</h1>
        <span className="font-mono text-[11px] text-t3">{active.length} active</span>
      </div>

      {active.length === 0 ? (
        <EmptyState title="No prayers yet" description="Add your first prayer" to="/new" />
      ) : (
        <div className="flex flex-col gap-px border border-rim">
          {active.map(prayer => (
            <PrayerCard key={prayer.id} prayer={prayer} />
          ))}
        </div>
      )}
    </div>
  )
}
