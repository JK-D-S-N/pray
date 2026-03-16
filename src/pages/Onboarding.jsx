import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUser } from '../storage'

export default function Onboarding() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    saveUser(name)
    navigate('/')
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 bg-bg">
      <div className="w-full max-w-sm mx-auto">
        <p className="font-mono text-[11px] uppercase tracking-widest text-t3 mb-6">sounding</p>

        <h1 className="text-3xl font-semibold text-t1 tracking-tight leading-tight mb-2">
          A quiet place<br />for your prayers.
        </h1>
        <p className="text-sm text-t2 mb-10">
          Your data lives on this device.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-widest text-t3 mb-2">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. James"
              autoFocus
              className="w-full border border-rim bg-surface text-t1 placeholder-t3 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gold text-bg font-semibold py-2.5 text-sm tracking-tight disabled:opacity-30 hover:brightness-110 transition-all"
          >
            Get started
          </button>
        </form>
      </div>
    </div>
  )
}
