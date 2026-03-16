import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { addPrayer, getUserGroups } from '../storage'
import { useStorage } from '../hooks/useStorage'

const field = 'w-full border border-rim bg-surface text-t1 placeholder-t3 px-3 py-2.5 text-sm focus:outline-none focus:border-gold'
const label = 'block font-mono text-[11px] uppercase tracking-widest text-t3 mb-2'

export default function NewPrayer() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const preGroupId = params.get('group')

  const [userGroups] = useStorage(getUserGroups)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [shareWithGroup, setShareWithGroup] = useState(!!preGroupId)
  const [groupId, setGroupId] = useState(preGroupId || (userGroups[0]?.id ?? ''))

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    addPrayer({
      title,
      body,
      category: 'other',
      visibility: shareWithGroup && groupId ? 'group' : 'private',
      groupId: shareWithGroup ? groupId : undefined,
    })
    navigate('/')
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate(-1)} className="text-t3 hover:text-t2 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-t1 tracking-tight">New Prayer</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What are you praying for?"
            autoFocus
            className={field}
          />
        </div>

        <div>
          <label className={label}>Details</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Add more context (optional)"
            rows={4}
            className={`${field} resize-none`}
          />
        </div>

        {userGroups.length > 0 && (
          <div className="border border-rim p-3 bg-surface">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={shareWithGroup}
                onChange={e => setShareWithGroup(e.target.checked)}
                className="accent-gold w-3.5 h-3.5"
              />
              <span className="font-mono text-[11px] uppercase tracking-widest text-t2">Share with a group</span>
            </label>
            {shareWithGroup && (
              <select
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
                className={`mt-3 ${field}`}
              >
                {userGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full bg-gold text-bg font-semibold py-2.5 text-sm tracking-tight disabled:opacity-30 hover:brightness-110 transition-all"
        >
          Add prayer
        </button>
      </form>
    </div>
  )
}
