import { useState } from 'react'
import { supabase } from '../supabase'

export default function Onboarding() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    setError('')

    const redirectTo = window.location.origin + import.meta.env.BASE_URL + 'auth/callback'

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        data: { name: name.trim() },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="min-h-dvh flex flex-col justify-center px-6 bg-bg">
        <div className="w-full max-w-sm mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-widest text-t3 mb-6">sounding</p>
          <h1 className="text-3xl font-semibold text-t1 tracking-tight leading-tight mb-2">
            Check your email.
          </h1>
          <p className="text-sm text-t2 mb-6">
            We sent a sign-in link to <span className="text-t1">{email}</span>. Tap it to continue.
          </p>
          <button
            onClick={() => setSent(false)}
            className="font-mono text-[11px] uppercase tracking-widest text-t3 hover:text-t2 transition-colors"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 bg-bg">
      <div className="w-full max-w-sm mx-auto">
        <p className="font-mono text-[11px] uppercase tracking-widest text-t3 mb-6">sounding</p>

        <h1 className="text-3xl font-semibold text-t1 tracking-tight leading-tight mb-2">
          A quiet place<br />for your prayers.
        </h1>
        <p className="text-sm text-t2 mb-10">
          Your prayers, saved and synced.
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

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-widest text-t3 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-rim bg-surface text-t1 placeholder-t3 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {error && (
            <p className="font-mono text-[11px] text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={!name.trim() || !email.trim() || loading}
            className="w-full bg-gold text-bg font-semibold py-2.5 text-sm tracking-tight disabled:opacity-30 hover:brightness-110 transition-all"
          >
            {loading ? 'Sending…' : 'Send sign-in link'}
          </button>
        </form>
      </div>
    </div>
  )
}
