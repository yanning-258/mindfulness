import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScoreCard from '../components/ScoreCard'

const QUOTES = [
  "You don't have to see the whole staircase, just take the first step.",
  "Be gentle with yourself. You are a child of the universe.",
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "It's okay to not be okay, as long as you're not giving up.",
  "Self-care is not selfish. You cannot serve from an empty vessel.",
  "Small steps in the right direction can turn out to be the biggest steps of your life.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
]

const QUOTE = QUOTES[Math.floor(Math.random() * QUOTES.length)]

const TODAY = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
})

const QUICK_LINKS = [
  { to: '/journal', icon: '📖', label: 'Write in Journal', desc: 'Capture your thoughts' },
  { to: '/chat',    icon: '🐶', label: 'Chat with Mia',    desc: 'Talk to your companion' },
  { to: '/events',  icon: '📅', label: 'View Events',      desc: 'Upcoming workshops' },
  { to: '/mood',    icon: '😊', label: "Log Today's Mood", desc: 'How are you feeling?' },
]

export default function Home() {
  const [score, setScore] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/scores')
      .then(r => r.json())
      .then(setScore)
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-purple-800">Welcome, Angela! 👋</h1>
        <p className="text-sm text-purple-500 mt-1">{TODAY}</p>
        <p className="text-purple-600 font-semibold mt-3 text-lg">MINDfulness matters!</p>
      </div>

      {/* Daily Quote */}
      <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2">Daily Inspiration</p>
        <p className="text-gray-600 italic leading-relaxed">"{QUOTE}"</p>
      </div>

      {/* Score Card */}
      <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
        <ScoreCard score={score} />
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-base font-semibold text-gray-600 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_LINKS.map(({ to, icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-purple-300 transition-all text-center group"
            >
              <div className="text-4xl mb-3">{icon}</div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 leading-tight">{label}</p>
              <p className="text-xs text-gray-400 mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
