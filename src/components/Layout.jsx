import { NavLink, Outlet, Link } from 'react-router-dom'
import { Home, Users, Plus, Settings } from 'lucide-react'

const LEFT_NAV = [
  { to: '/',       icon: Home,  label: 'Prayers', end: true  },
  { to: '/groups', icon: Users, label: 'Groups',  end: false },
]

const RIGHT_NAV = [
  { to: '/settings', icon: Settings, label: 'Settings', end: false },
]

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col max-w-lg mx-auto">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg border-t border-rim z-10">
        <div className="max-w-lg mx-auto flex items-center">
          {LEFT_NAV.map(({ to, icon: Icon, label, end }) => (
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

          {/* Add — centre, elevated */}
          <Link
            to="/new"
            className="flex-1 flex flex-col items-center gap-1 py-2 hover:brightness-110 transition-all"
          >
            <div className="w-9 h-9 bg-gold flex items-center justify-center">
              <Plus className="w-5 h-5 text-bg" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold">Add</span>
          </Link>

          {RIGHT_NAV.map(({ to, icon: Icon, label, end }) => (
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
        </div>
      </nav>
    </div>
  )
}
