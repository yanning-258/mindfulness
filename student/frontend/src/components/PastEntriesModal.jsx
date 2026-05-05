import { useState, useEffect } from 'react'
import API from '../api'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function PastEntriesModal({ onClose }) {
  const [entries, setEntries] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/journal`)
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-700">My Past Entries</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto px-6 py-4 space-y-3 flex-1">
          {loading && <p className="text-sm text-gray-400 text-center py-8">Loading…</p>}
          {!loading && entries.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No entries yet.</p>
          )}
          {entries.map(entry => (
            <div
              key={entry.id}
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex gap-3 text-xs text-gray-400">
                  <span>{formatDate(entry.timestamp)}</span>
                  <span>{formatTime(entry.timestamp)}</span>
                  <span>{entry.word_count} words</span>
                </div>
                <span className="text-xs text-purple-400">{expanded === entry.id ? '▲' : '▼'}</span>
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
    </div>
  )
}
