import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/mood', label: 'Mood' },
  { to: '/journal', label: 'Journal' },
  { to: '/events', label: 'Events' },
  { to: '/chat', label: 'Chat with Mia' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-purple-700 tracking-tight">MINDfulness</span>
          <p className="text-xs text-gray-400 leading-tight">Imperial College London Student Well-being</p>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors pb-1
                ${pathname === to
                  ? 'text-purple-600 border-b-2 border-purple-400'
                  : 'text-gray-500 hover:text-purple-500'}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-500 hover:text-purple-500"
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-purple-50 bg-white px-4 py-3 space-y-3">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`block text-sm font-medium py-1
                ${pathname === to ? 'text-purple-600' : 'text-gray-500'}`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
