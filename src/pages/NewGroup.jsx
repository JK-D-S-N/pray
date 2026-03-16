import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Share2 } from 'lucide-react'
import { createGroup } from '../storage'
import { shareText, groupInviteText } from '../share'

export default function NewGroup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [created, setCreated] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setCreated(createGroup(name))
  }

  if (created) {
    return (
      <div className="px-4 pt-5 pb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-1">Group created</p>
        <h1 className="text-xl font-semibold text-t1 tracking-tight mb-5">{created.name}</h1>

        <div className="border border-rim bg-surface p-6 mb-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-3">Invite code</p>
          <p className="font-mono text-5xl font-bold text-gold tracking-[0.25em]">{created.inviteCode}</p>
        </div>

        <button
          onClick={() => shareText(groupInviteText(created.name, created.inviteCode))}
          className="w-full flex items-center justify-center gap-2 py-2.5 mb-2 bg-[#25D366] text-bg font-mono text-[11px] uppercase tracking-widest hover:brightness-105 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share invite
        </button>

        <button
          onClick={() => navigate(`/groups/${created.id}`, { replace: true })}
          className="w-full py-2.5 border border-rim text-t3 font-mono text-[11px] uppercase tracking-widest hover:border-rim-hi transition-colors"
        >
          Go to group
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate(-1)} className="text-t3 hover:text-t2 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-t1 tracking-tight">New Group</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-t3 mb-2">Group name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Thursday homegroup"
            autoFocus
            className="w-full border border-rim bg-surface text-t1 placeholder-t3 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-gold text-bg font-semibold py-2.5 text-sm tracking-tight disabled:opacity-30 hover:brightness-110 transition-all"
        >
          Create group
        </button>
      </form>
    </div>
  )
}
