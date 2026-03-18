import { useState } from 'react'
import { getPrayers, getGroup } from '../storage'
import { useStorage } from '../hooks/useStorage'
import PrayerCard from '../components/PrayerCard'
import EmptyState from '../components/EmptyState'
import { ChevronDown, Users } from 'lucide-react'

export default function Home() {
  const [prayers] = useStorage(getPrayers)
  const [expandedGroups, setExpandedGroups] = useState(new Set())

  const active = prayers.filter(p => p.status === 'active')
  const privatePrayers = active.filter(p => p.visibility !== 'group')
  const groupPrayers = active.filter(p => p.visibility === 'group')

  const grouped = {}
  groupPrayers.forEach(p => {
    if (!grouped[p.groupId]) grouped[p.groupId] = []
    grouped[p.groupId].push(p)
  })
  const groupEntries = Object.entries(grouped)

  function toggle(groupId) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      next.has(groupId) ? next.delete(groupId) : next.add(groupId)
      return next
    })
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-xl font-semibold text-t1 tracking-tight">Prayers</h1>
        <span className="font-mono text-[11px] text-t3">{active.length} active</span>
      </div>

      {active.length === 0 ? (
        <EmptyState title="No prayers yet" description="Add your first prayer" to="/new" />
      ) : (
        <div className="flex flex-col gap-3">
          {privatePrayers.length > 0 && (
            <div className="flex flex-col gap-px border border-rim">
              {privatePrayers.map(prayer => (
                <PrayerCard key={prayer.id} prayer={prayer} />
              ))}
            </div>
          )}

          {groupEntries.map(([groupId, list]) => {
            const group = getGroup(groupId)
            const expanded = expandedGroups.has(groupId)
            const count = list.length

            // Single group prayer — render as a plain card, no stack
            if (count === 1) {
              return <PrayerCard key={groupId} prayer={list[0]} />
            }

            return (
              <div
                key={groupId}
                className="relative"
                style={{ marginBottom: !expanded && count >= 3 ? 3 : !expanded && count >= 2 ? 1.5 : 0 }}
              >
                {/* Back cards — absolutely positioned, offset down+right */}
                {!expanded && count >= 3 && (
                  <div
                    className="absolute inset-0 border border-rim bg-surface"
                    style={{ transform: 'translate(3px, 3px)', zIndex: 1 }}
                  />
                )}
                {!expanded && count >= 2 && (
                  <div
                    className="absolute inset-0 border border-rim bg-surface"
                    style={{ transform: 'translate(1.5px, 1.5px)', zIndex: 2 }}
                  />
                )}

                {/* Front card */}
                <button
                  onClick={() => toggle(groupId)}
                  className="relative w-full px-3 pt-2.5 pb-3 bg-surface hover:bg-elevated transition-colors border border-rim text-left"
                  style={{ zIndex: 3 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-t3">
                      <Users className="w-3 h-3" />
                      {group?.name || 'Group'}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-t3">
                      {count} prayer{count !== 1 ? 's' : ''}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                  {!expanded && (
                    <p className="font-medium text-t1 leading-snug tracking-tight line-clamp-1">
                      {list[0].title}
                    </p>
                  )}
                </button>

                {expanded && (
                  <div className="flex flex-col gap-px border-x border-b border-rim">
                    {list.map(prayer => (
                      <PrayerCard key={prayer.id} prayer={prayer} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
