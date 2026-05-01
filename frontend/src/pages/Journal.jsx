import { useState, useEffect } from 'react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Journal() {
  const [text, setText] = useState('')
  const [entries, setEntries] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/journal')
      .then(r => r.json())
      .then(setEntries)
  }, [])

  async function submit() {
    if (!text.trim()) return
    setSaving(true)
    const res = await fetch('http://localhost:8000/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const entry = await res.json()
    setEntries(prev => [entry, ...prev])
    setText('')
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-purple-800">Daily Journal</h1>
        <p className="text-gray-500 mt-1">This is your safe space to write freely.</p>
      </div>

      {/* Write area */}
      <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm space-y-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What's on your mind?"
          rows={8}
          className="w-full resize-none border border-gray-200 rounded-xl p-4 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 text-sm leading-relaxed"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
          <button
            onClick={submit}
            disabled={saving || !text.trim()}
            className="px-6 py-2 bg-purple-500 text-white rounded-xl text-sm font-semibold hover:bg-purple-600 disabled:opacity-40 transition-colors"
          >
            {saving ? 'Saving…' : 'Submit Entry'}
          </button>
        </div>
        {saved && <p className="text-sm text-green-600 font-medium">Entry saved ✓</p>}
      </div>

      {/* Past entries */}
      <div>
        <h2 className="text-base font-semibold text-gray-600 mb-4">
          Past Entries {entries.length > 0 && <span className="text-gray-400 font-normal">({entries.length})</span>}
        </h2>
        {entries.length === 0 ? (
          <p className="text-gray-400 text-sm">No entries yet. Write your first one above!</p>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <div
                key={entry.id}
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm cursor-pointer hover:border-purple-200 transition-all"
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
        )}
      </div>
    </div>
  )
}
