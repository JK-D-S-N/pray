import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Trash2, Archive, CheckCircle2, Share2, Lock, Users, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { getPrayer, getPrayers, updatePrayer, deletePrayer, markAnswered, getGroup, logPrayed, getPrayedCount } from '../storage'
import { useStorage } from '../hooks/useStorage'
import { shareText, answeredPrayerText } from '../share'

const CATEGORIES = ['personal', 'family', 'health', 'work', 'other']
const field = 'w-full border border-rim bg-bg text-t1 placeholder-t3 px-3 py-2.5 text-sm focus:outline-none focus:border-gold'

export default function PrayerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [prayer, refresh] = useStorage(() => getPrayer(id), [id])
  const [allPrayers] = useStorage(getPrayers)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [answering, setAnswering] = useState(false)
  const [answerNote, setAnswerNote] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const active = allPrayers.filter(p => p.status === 'active')
  const total = active.length
  const currentIdx = active.findIndex(p => p.id === id)

  function handlePrev() {
    if (currentIdx > 0) navigate(`/prayer/${active[currentIdx - 1].id}`, { replace: true })
  }

  function handleNext() {
    if (total < 2) return
    logPrayed(id)
    navigate(`/prayer/${active[(currentIdx + 1) % total].id}`, { replace: true })
  }

  if (!prayer) {
    return (
      <div className="px-4 pt-5">
        <button onClick={() => navigate('/')} className="text-t3 mb-4 flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" /> All
        </button>
        <p className="font-mono text-sm text-t3">Prayer not found.</p>
      </div>
    )
  }

  const group = prayer.groupId ? getGroup(prayer.groupId) : null

  function startEdit() {
    setEditTitle(prayer.title)
    setEditBody(prayer.body || '')
    setEditCategory(prayer.category || 'other')
    setEditing(true)
  }

  function saveEdit() {
    updatePrayer(id, { title: editTitle, body: editBody, category: editCategory })
    setEditing(false)
    refresh()
  }

  function handleMarkAnswered() {
    markAnswered(id, answerNote)
    setAnswering(false)
    refresh()
  }

  function handleArchive() {
    updatePrayer(id, { status: 'archived' })
    navigate('/')
  }

  function handleDelete() {
    deletePrayer(id)
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-108px)]">
      {/* nav row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-rim flex-shrink-0">
        <button
          onClick={() => navigate('/')}
          className="font-mono text-[11px] uppercase tracking-widest text-t3 hover:text-t2 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> All
        </button>

        {prayer.status === 'active' && total > 0 && (
          <div className="flex items-center gap-1">
            {total > 1 && (
              <span className="font-mono text-[10px] text-t3 mr-1">
                {currentIdx + 1} / {total}
              </span>
            )}
            <button
              onClick={handlePrev}
              disabled={currentIdx <= 0}
              className="p-1.5 text-t3 hover:text-t2 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={total < 2}
              className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-t3 hover:text-gold disabled:opacity-20 transition-colors px-1"
            >
              Prayed <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex-1 px-4 pt-5 pb-6 overflow-y-auto">
        {editing ? (
          <div className="space-y-3">
            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className={field} autoFocus />
            <textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={4} className={`${field} resize-none`} />
            <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className={field}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="flex-1 py-2.5 font-mono text-[11px] uppercase tracking-widest text-t3 border border-rim hover:border-rim-hi">
                Cancel
              </button>
              <button onClick={saveEdit} disabled={!editTitle.trim()} className="flex-1 py-2.5 bg-gold text-bg font-mono text-[11px] uppercase tracking-widest disabled:opacity-30 hover:brightness-110">
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* meta */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-widest text-t3">{prayer.category}</span>
              <span className="text-t3 font-mono text-[10px]">·</span>
              <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-t3">
                {group ? <><Users className="w-3 h-3" />{group.name}</> : <><Lock className="w-3 h-3" />private</>}
              </span>
              {prayer.status === 'answered' && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-500 ml-auto">answered</span>
              )}
              {prayer.status === 'archived' && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-t3 ml-auto">archived</span>
              )}
            </div>

            <h1 className="text-2xl font-semibold text-t1 tracking-tight leading-snug mb-3">{prayer.title}</h1>

            {prayer.body && (
              <p className="text-sm text-t2 leading-relaxed mb-4">{prayer.body}</p>
            )}

            <p className="font-mono text-[11px] text-t3 mb-6">
              Added {format(new Date(prayer.createdAt), 'MMM d, yyyy')}
              {getPrayedCount(id) > 0 && (
                <span className="ml-3">· Prayed {getPrayedCount(id)} time{getPrayedCount(id) !== 1 ? 's' : ''}</span>
              )}
            </p>

            {/* answered state */}
            {prayer.status === 'answered' && prayer.answeredAt && (
              <div className="border border-emerald-900 bg-emerald-950/20 p-4 mb-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-2">
                  Answered {format(new Date(prayer.answeredAt), 'MMM d, yyyy')}
                </p>
                {prayer.answeredNote && (
                  <p className="text-sm text-emerald-300 leading-relaxed mb-3">{prayer.answeredNote}</p>
                )}
                <button
                  onClick={() => shareText(answeredPrayerText(prayer.title, prayer.answeredNote))}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-600 hover:text-emerald-400 transition-colors"
                >
                  <Share2 className="w-3 h-3" /> Share this answer
                </button>
              </div>
            )}

            {/* active actions */}
            {prayer.status === 'active' && (
              <div className="space-y-2 mt-2">
                {/* Edit — ghost/outline */}
                <button
                  onClick={startEdit}
                  className="w-full py-2.5 border border-t2 text-t1 font-mono text-[11px] uppercase tracking-widest hover:bg-elevated transition-colors"
                >
                  Edit
                </button>

                {/* Archive | Answered */}
                {!answering ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleArchive}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-t2 border border-rim hover:border-rim-hi transition-colors"
                    >
                      <Archive className="w-3 h-3" /> Archive
                    </button>
                    <button
                      onClick={() => setAnswering(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gold text-bg font-mono text-[11px] uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Answered
                    </button>
                  </div>
                ) : (
                  <div className="border border-yellow-900 bg-gold-dim p-4 space-y-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gold">How did God answer?</p>
                    <textarea
                      value={answerNote}
                      onChange={e => setAnswerNote(e.target.value)}
                      placeholder="Add a note (optional)"
                      rows={3}
                      autoFocus
                      className={`${field} text-sm`}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setAnswering(false)} className="flex-1 py-2 font-mono text-[11px] uppercase tracking-widest text-t3 border border-rim hover:border-rim-hi">
                        Cancel
                      </button>
                      <button onClick={handleMarkAnswered} className="flex-1 py-2 bg-gold text-bg font-mono text-[11px] uppercase tracking-widest hover:brightness-110">
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* archived — delete available here only */}
            {prayer.status === 'archived' && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-red-800 border border-red-950 hover:border-red-700 mt-2 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            )}
          </>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-surface border border-rim w-full max-w-sm p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-t3 mb-1">Confirm delete</p>
            <p className="font-medium text-t1 tracking-tight mb-4">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 font-mono text-[11px] uppercase tracking-widest text-t3 border border-rim hover:border-rim-hi">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-800 text-t1 font-mono text-[11px] uppercase tracking-widest hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
