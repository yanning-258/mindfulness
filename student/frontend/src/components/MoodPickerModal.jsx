import { useState } from 'react'

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😟', label: 'Worried' },
  { emoji: '😰', label: 'Stressed' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '😕', label: 'Confused' },
  { emoji: '😬', label: 'Anxious' },
]

function formatModalDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

export default function MoodPickerModal({ dateStr, onSave, onClose }) {
  const [saving, setSaving] = useState(false)

  async function handlePick(emoji, label) {
    setSaving(true)
    try {
      await onSave(dateStr, emoji, label)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-700 leading-snug pr-4">
            How were you feeling on<br />
            <span className="text-pink-500">{formatModalDate(dateStr)}?</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {MOODS.map(({ emoji, label }) => (
            <button
              key={emoji}
              onClick={() => handlePick(emoji, label)}
              disabled={saving}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-pink-50 hover:scale-105 transition-all disabled:opacity-50 focus:outline-none"
            >
              <span className="text-5xl leading-none">{emoji}</span>
              <span className="text-xs text-gray-500 mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
