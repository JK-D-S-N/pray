import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { upsertProfile, fetchAllUserData } from '../sync'
import { hydrateAll } from '../storage'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    async function handleCallback() {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        setError('Sign-in failed. Please try again.')
        return
      }

      const { user } = session

      // Create profile if this is first sign-in
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existing) {
        const name = user.user_metadata?.name || 'Friend'
        const avatarInitials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        await upsertProfile({ id: user.id, name, avatarInitials })
      }

      // Pull all data from Supabase and populate localStorage
      const data = await fetchAllUserData(user.id)
      hydrateAll(data)

      navigate('/', { replace: true })
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-bg gap-4">
        <p className="text-sm text-t2">{error}</p>
        <button
          onClick={() => navigate('/onboard', { replace: true })}
          className="font-mono text-[11px] uppercase tracking-widest text-gold hover:brightness-110"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg">
      <p className="font-mono text-[11px] uppercase tracking-widest text-t3">Signing in…</p>
    </div>
  )
}
