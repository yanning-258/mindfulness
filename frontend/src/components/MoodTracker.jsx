import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MoodCircle from './MoodCircle'
import MoodPickerModal from './MoodPickerModal'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getPast7Days() {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

export default function MoodTracker() {
  const [moodMap, setMoodMap] = useState({})
  const [activeDate, setActiveDate] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/mood')
      .then(r => r.json())
      .then(data => {
        const map = {}
        data.forEach(m => { map[m.date] = m })
        setMoodMap(map)
      })
  }, [])

  async function handleSave(dateStr, emoji, label) {
    const res = await fetch('http://localhost:8000/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr, emoji, mood_label: label }),
    })
    const saved = await res.json()
    setMoodMap(prev => ({ ...prev, [dateStr]: saved }))
    setActiveDate(null)
  }

  const days = getPast7Days()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-700">How are you feeling today?</h2>
        <Link to="/mood-stats" className="text-sm font-medium text-pink-500 hover:text-pink-600">
          More &gt;
        </Link>
      </div>

      <div className="flex justify-between gap-1">
        {days.map(dateStr => {
          const d = new Date(dateStr + 'T00:00:00')
          return (
            <div key={dateStr} className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-500">{DAY_NAMES[d.getDay()]}</span>
              <MoodCircle
                mood={moodMap[dateStr] || null}
                onClick={() => setActiveDate(dateStr)}
              />
            </div>
          )
        })}
      </div>

      {activeDate && (
        <MoodPickerModal
          dateStr={activeDate}
          onSave={handleSave}
          onClose={() => setActiveDate(null)}
        />
      )}
    </div>
  )
}
