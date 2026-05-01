import { useState, useEffect } from 'react'
import MoodCalendar from '../components/MoodCalendar'

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😟', label: 'Worried' },
  { emoji: '😰', label: 'Stressed' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '😕', label: 'Confused' },
]

export default function Mood() {
  const [moods, setMoods] = useState([])
  const [selected, setSelected] = useState(null)
  const [todayMood, setTodayMood] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetch('http://localhost:8000/mood')
      .then(r => r.json())
      .then(data => {
        setMoods(data)
        const t = data.find(m => m.date === today)
        if (t) {
          setTodayMood(t)
          setSelected(t.emoji)
        }
      })
  }, [])

  async function saveMood(emoji, label) {
    setSaving(true)
    setSaved(false)
    const res = await fetch('http://localhost:8000/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji, mood_label: label }),
    })
    const data = await res.json()
    setTodayMood(data)
    setSelected(emoji)
    setMoods(prev => {
      const filtered = prev.filter(m => m.date !== today)
      return [...filtered, data].sort((a, b) => a.date.localeCompare(b.date))
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-purple-800">Daily Mood Check-in</h1>
        <p className="text-gray-500 mt-1">Track how you're feeling, day by day.</p>
      </div>

      {/* Weekly strip */}
      <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-4">Your Week</p>
        <MoodCalendar moods={moods} />
      </div>

      {/* Mood picker */}
      <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-700 mb-1">
          {todayMood
            ? `You logged ${todayMood.emoji} ${todayMood.mood_label} today — change it?`
            : 'How are you feeling today?'}
        </h2>
        <p className="text-sm text-gray-400 mb-5">Tap an emoji to log your mood</p>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {MOODS.map(({ emoji, label }) => (
            <button
              key={emoji}
              onClick={() => saveMood(emoji, label)}
              disabled={saving}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                ${selected === emoji
                  ? 'border-purple-400 bg-purple-50 scale-105 shadow-sm'
                  : 'border-transparent bg-gray-50 hover:border-purple-200 hover:bg-purple-50'}`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-gray-500">{label}</span>
            </button>
          ))}
        </div>

        {saved && (
          <p className="text-sm text-green-600 font-medium mt-4">Mood logged ✓</p>
        )}
      </div>
    </div>
  )
}
