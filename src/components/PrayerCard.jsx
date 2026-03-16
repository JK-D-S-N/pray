import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Lock, Users } from 'lucide-react'
import { getGroup } from '../storage'

export default function PrayerCard({ prayer }) {
  const date = format(new Date(prayer.createdAt), 'MMM d')
  const group = prayer.groupId ? getGroup(prayer.groupId) : null

  return (
    <Link
      to={`/prayer/${prayer.id}`}
      className="block px-3 pt-2.5 pb-3 bg-surface hover:bg-elevated transition-colors border-b border-rim last:border-0"
    >
      <h3 className="font-medium text-t1 leading-snug tracking-tight mb-1">{prayer.title}</h3>

      {prayer.body && (
        <p className="text-sm text-t2 line-clamp-1 leading-relaxed mb-1.5">{prayer.body}</p>
      )}

      <div className="flex items-center gap-2.5 mt-1">
        <span className="font-mono text-[10px] text-t3">{date}</span>
        {prayer.category && (
          <>
            <span className="text-t3 font-mono text-[10px]">·</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-t3">{prayer.category}</span>
          </>
        )}
        <span className="ml-auto flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-t3">
          {group
            ? <><Users className="w-3 h-3" />{group.name}</>
            : <><Lock className="w-3 h-3" />private</>
          }
        </span>
      </div>
    </Link>
  )
}
