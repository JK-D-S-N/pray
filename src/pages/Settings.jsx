import { useState } from 'react'
import { Download, ChevronRight, X, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getUser, updateUser, exportData, getPrayers, getCategories, addCategory, deleteCategory } from '../storage'
import { useStorage } from '../hooks/useStorage'
import Avatar from '../components/Avatar'

const DEFAULT_CATEGORIES = ['faith', 'family', 'health', 'work', 'other']

const field = 'border border-rim bg-bg text-t1 px-3 py-2 text-sm focus:outline-none focus:border-gold'

export default function Settings() {
  const [user, refreshUser] = useStorage(getUser)
  const [categories, refreshCategories] = useStorage(getCategories)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [prayers] = useStorage(getPrayers)
  const [newCategory, setNewCategory] = useState('')

  const activeCount = prayers.filter(p => p.status === 'active').length
  const answeredCount = prayers.filter(p => p.status === 'answered').length

  function saveName(e) {
    e.preventDefault()
    if (!nameInput.trim()) return
    updateUser({ name: nameInput })
    setEditingName(false)
    refreshUser()
  }

  function handleExport() {
    const data = exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sounding-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) return null

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-semibold text-t1 tracking-tight mb-6">Settings</h1>

      {/* Profile */}
      <section className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-3">Profile</p>
        <div className="border border-rim bg-surface p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar initials={user.avatarInitials} size="lg" />
            <div>
              <p className="font-medium text-t1 tracking-tight">{user.name}</p>
              <p className="font-mono text-[11px] text-t3">{activeCount} active prayer{activeCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {editingName ? (
            <form onSubmit={saveName} className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                autoFocus
                className={`flex-1 ${field}`}
              />
              <button type="button" onClick={() => setEditingName(false)} className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-t3 border border-rim hover:border-rim-hi">
                Cancel
              </button>
              <button type="submit" disabled={!nameInput.trim()} className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest bg-gold text-bg disabled:opacity-30 hover:brightness-110">
                Save
              </button>
            </form>
          ) : (
            <button
              onClick={() => { setNameInput(user.name); setEditingName(true) }}
              className="font-mono text-[11px] uppercase tracking-widest text-gold hover:brightness-110 transition-all"
            >
              Edit name
            </button>
          )}
        </div>
      </section>

      {/* Answered prayers */}
      <section className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-3">History</p>
        <Link
          to="/answered"
          className="w-full flex items-center justify-between border border-rim bg-surface px-4 py-3 hover:border-rim-hi transition-colors"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-t2">Answered prayers</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-t3">{answeredCount}</span>
            <ChevronRight className="w-3.5 h-3.5 text-t3" />
          </div>
        </Link>
      </section>

      {/* Categories */}
      <section className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-3">Categories</p>
        <div className="border border-rim bg-surface">
          <div className="divide-y divide-rim">
            {categories.map(c => (
              <div key={c} className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-t1 capitalize">{c}</span>
                {!DEFAULT_CATEGORIES.includes(c) && (
                  <button
                    onClick={() => { deleteCategory(c); refreshCategories() }}
                    className="text-t3 hover:text-t1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <form
            onSubmit={e => {
              e.preventDefault()
              addCategory(newCategory)
              setNewCategory('')
              refreshCategories()
            }}
            className="flex border-t border-rim"
          >
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Add category…"
              className="flex-1 bg-transparent text-sm text-t1 placeholder-t3 px-4 py-2.5 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newCategory.trim()}
              className="px-3 text-gold disabled:opacity-30 hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Data */}
      <section>
        <p className="font-mono text-[10px] uppercase tracking-widest text-t3 mb-3">Data</p>
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 border border-rim bg-surface px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-t3 hover:border-rim-hi hover:text-t2 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export all data
        </button>
      </section>
    </div>
  )
}
