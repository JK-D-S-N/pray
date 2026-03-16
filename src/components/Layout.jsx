import { NavLink, Outlet, Link } from 'react-router-dom'
import { Home, Users, Plus, Settings } from 'lucide-react'

const NAV = [
  { to: '/',         icon: Home,     label: 'Prayers',  end: true  },
  { to: '/groups',   icon: Users,    label: 'Groups',   end: false },
  { to: '/settings', icon: Settings, label: 'Settings', end: false },
]

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col max-w-lg mx-auto">
      {/* title bar */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-bg border-b border-rim">
        <div className="max-w-lg mx-auto flex items-center px-4 h-11">
          <span className="font-mono text-[11px] uppercase tracking-widest text-t3">sounding</span>
        </div>
      </header>

      <main className="flex-1 pt-11 pb-16">
        <Outlet />
      </main>

      {/* bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg border-t border-rim z-10">
        <div className="max-w-lg mx-auto flex items-end">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                  isActive ? 'text-gold' : 'text-t3 hover:text-t2'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
              <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
            </NavLink>
          ))}

          {/* Add tab */}
          <Link to="/new" className="flex-1 flex flex-col items-center gap-1 py-3 text-gold hover:brightness-110 transition-all">
            <div className="w-[18px] h-[18px] bg-gold flex items-center justify-center">
              <Plus className="w-3 h-3 text-bg" strokeWidth={3} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest">Add</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
