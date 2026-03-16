import { Link } from 'react-router-dom'
import { Users, Plus, LogIn } from 'lucide-react'
import { getUserGroups, getMembers } from '../storage'
import { useStorage } from '../hooks/useStorage'
import EmptyState from '../components/EmptyState'

export default function Groups() {
  const [groups] = useStorage(getUserGroups)
  const [members] = useStorage(getMembers)

  function memberCount(groupId) {
    return members.filter(m => m.groupId === groupId).length
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-semibold text-t1 tracking-tight mb-5">Groups</h1>

      <div className="flex gap-2 mb-5">
        <Link
          to="/groups/new"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gold text-bg font-mono text-[11px] uppercase tracking-widest hover:brightness-110 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Create
        </Link>
        <Link
          to="/groups/join"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-rim text-t3 font-mono text-[11px] uppercase tracking-widest hover:border-rim-hi hover:text-t2 transition-colors"
        >
          <LogIn className="w-3.5 h-3.5" />
          Join
        </Link>
      </div>

      {groups.length === 0 ? (
        <EmptyState title="No groups yet" description="Create or join a group to share prayers" />
      ) : (
        <div className="flex flex-col gap-px border border-rim">
          {groups.map(group => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="flex items-center justify-between px-3 py-3 bg-surface hover:bg-elevated transition-colors border-b border-rim last:border-0"
            >
              <div>
                <p className="font-medium text-t1 tracking-tight text-sm">{group.name}</p>
                <p className="font-mono text-[10px] text-t3 mt-0.5">{memberCount(group.id)} member{memberCount(group.id) !== 1 ? 's' : ''}</p>
              </div>
              <Users className="w-3.5 h-3.5 text-t3" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
