import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function calcStreak(entries) {
  if (!entries.length) return 0
  const dates = [...new Set(entries.map(e => e.timestamp.split('T')[0]))].sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (dates[0] !== today && dates[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (prev - curr) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

function StatCard({ value, label, icon }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function PlaceholderCard({ title }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-dashed border-gray-200 opacity-50">
      <p className="text-sm font-semibold text-gray-400">{title}</p>
      <p className="text-xs text-gray-300 mt-1">Coming soon</p>
    </div>
  )
}

export default function JournalMore() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch(`${API}/journal`)
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const totalWords = entries.reduce((sum, e) => sum + e.word_count, 0)
  const streak = calcStreak(entries)

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3 shadow-sm">
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
        <h1 className="text-base font-semibold text-gray-700">My Journal</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard value={entries.length} label="Total entries" icon="📝" />
          <StatCard value={totalWords.toLocaleString()} label="Words written" icon="✍️" />
          <StatCard value={streak} label={`Day streak${streak === 1 ? '' : 's'}`} icon="🔥" />
        </div>

        {/* Entries list */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            All Entries
          </h2>

          {loading && (
            <p className="text-sm text-gray-400 text-center py-12">Loading…</p>
          )}

          {!loading && entries.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <p className="text-4xl mb-3">📖</p>
              <p className="text-gray-500 text-sm">No entries yet. Write your first one on the dashboard!</p>
            </div>
          )}

          <div className="space-y-3">
            {entries.map(entry => (
              <div
                key={entry.id}
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>{formatDate(entry.timestamp)}</span>
                    <span>{formatTime(entry.timestamp)}</span>
                    <span>{entry.word_count} words</span>
                  </div>
                  <span className="text-xs text-purple-400 select-none">
                    {expanded === entry.id ? '▲' : '▼'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {expanded === entry.id
                    ? entry.text
                    : entry.text.slice(0, 100) + (entry.text.length > 100 ? '…' : '')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Future placeholder cards */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Coming Soon
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <PlaceholderCard title="📊 Mood & Journal Correlation" />
            <PlaceholderCard title="✍️ Writing Patterns" />
          </div>
        </div>
      </div>
    </div>
  )
}
