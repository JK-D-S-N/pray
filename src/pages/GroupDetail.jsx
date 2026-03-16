import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Copy, Check, Plus, Users, Share2 } from 'lucide-react'
import { getGroup, getPrayers, getMembers, isInGroup } from '../storage'
import { useStorage } from '../hooks/useStorage'
import { shareText, groupInviteText } from '../share'
import PrayerCard from '../components/PrayerCard'
import EmptyState from '../components/EmptyState'

export default function GroupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const [group] = useStorage(() => getGroup(id), [id])
  const [prayers] = useStorage(getPrayers)
  const [members] = useStorage(getMembers)

  if (!group) {
    return (
      <div className="px-4 pt-5">
        <button onClick={() => navigate(-1)} className="text-t3 mb-4 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <p className="font-mono text-sm text-t3">Group not found.</p>
      </div>
    )
  }

  const inGroup = isInGroup(id)
  const groupMembers = members.filter(m => m.groupId === id)
  const groupPrayers = prayers
    .filter(p => p.groupId === id && p.status === 'active')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  function copyCode() {
    navigator.clipboard.writeText(group.inviteCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function shareInvite() {
    shareText(groupInviteText(group.name, group.inviteCode))
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => navigate(-1)} className="text-t3 hover:text-t2 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-t1 tracking-tight flex-1 truncate">{group.name}</h1>
      </div>

      {/* invite code block */}
      <div className="border border-rim bg-surface p-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-1.5">Invite code</p>
            <p className="font-mono text-3xl font-bold text-gold tracking-[0.2em]">{group.inviteCode}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="flex items-center gap-1 font-mono text-[10px] text-t3">
              <Users className="w-3 h-3" />{groupMembers.length}
            </span>
            <button onClick={copyCode} className="text-t3 hover:text-t2 transition-colors" title="Copy code">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={shareInvite}
        className="w-full flex items-center justify-center gap-2 py-2 mb-4 bg-[#25D366] text-bg font-mono text-[11px] uppercase tracking-widest hover:brightness-105 transition-all"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share invite
      </button>

      {inGroup && (
        <Link
          to={`/new?group=${id}`}
          className="flex items-center justify-center gap-2 w-full py-2 mb-5 border border-rim text-t3 font-mono text-[11px] uppercase tracking-widest hover:border-rim-hi hover:text-t2 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add prayer to group
        </Link>
      )}

      <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-2">Group prayers</p>

      {groupPrayers.length === 0 ? (
        <EmptyState title="No prayers shared yet" description="Add a prayer to this group" />
      ) : (
        <div className="flex flex-col gap-px border border-rim">
          {groupPrayers.map(prayer => (
            <PrayerCard key={prayer.id} prayer={prayer} />
          ))}
        </div>
      )}
    </div>
  )
}
