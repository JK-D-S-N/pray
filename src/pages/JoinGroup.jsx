import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { findGroupByCode, addMember, getUser, isInGroup } from '../storage'

export default function JoinGroup() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const group = findGroupByCode(code)
    if (!group) {
      setError('No group found with that code.')
      return
    }
    const user = getUser()
    if (isInGroup(group.id)) {
      navigate(`/groups/${group.id}`)
      return
    }
    addMember(group.id, user.id, 'member')
    navigate(`/groups/${group.id}`, { replace: true })
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate(-1)} className="text-t3 hover:text-t2 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-t1 tracking-tight">Join a Group</h1>
      </div>

      <p className="text-sm text-t2 mb-6">Ask a group member for the invite code.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-t3 mb-2">Invite code</label>
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
            placeholder="——————"
            maxLength={6}
            autoFocus
            className="w-full border border-rim bg-surface text-gold placeholder-t3 px-3 py-4 font-mono tracking-[0.4em] text-center text-3xl focus:outline-none focus:border-gold uppercase"
          />
          {error && <p className="mt-2 font-mono text-[11px] text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={code.length < 6}
          className="w-full bg-gold text-bg font-semibold py-2.5 text-sm tracking-tight disabled:opacity-30 hover:brightness-110 transition-all"
        >
          Join group
        </button>
      </form>
    </div>
  )
}
