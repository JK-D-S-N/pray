import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { CheckCircle2 } from 'lucide-react'
import { getPrayers } from '../storage'
import { useStorage } from '../hooks/useStorage'
import EmptyState from '../components/EmptyState'
import Badge from '../components/Badge'

function groupByMonth(prayers) {
  const map = {}
  for (const p of prayers) {
    const key = format(parseISO(p.answeredAt), 'MMMM yyyy')
    if (!map[key]) map[key] = []
    map[key].push(p)
  }
  return map
}

export default function Answered() {
  const [prayers] = useStorage(getPrayers)

  const answered = prayers
    .filter(p => p.status === 'answered' && p.answeredAt)
    .sort((a, b) => new Date(b.answeredAt) - new Date(a.answeredAt))

  const grouped = groupByMonth(answered)

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-xl font-semibold text-t1 tracking-tight">Answered</h1>
        <span className="font-mono text-[11px] text-t3">{answered.length} total</span>
      </div>

      {answered.length === 0 ? (
        <EmptyState title="Nothing here yet" description="Mark a prayer as answered and it appears here" />
      ) : (
        <div className="space-y-7">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-2 pb-2 border-b border-rim">{month}</p>
              <div className="flex flex-col gap-px border border-rim">
                {items.map(prayer => (
                  <Link
                    key={prayer.id}
                    to={`/prayer/${prayer.id}`}
                    className="flex items-start gap-3 px-3 py-3 bg-surface hover:bg-elevated transition-colors border-b border-rim last:border-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-t1 tracking-tight text-sm leading-snug">{prayer.title}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge category={prayer.category} />
                        <span className="font-mono text-[10px] text-t3">
                          {format(parseISO(prayer.answeredAt), 'MMM d')}
                        </span>
                      </div>
                      {prayer.answeredNote && (
                        <p className="font-mono text-[11px] text-emerald-700 mt-1 line-clamp-1">{prayer.answeredNote}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
