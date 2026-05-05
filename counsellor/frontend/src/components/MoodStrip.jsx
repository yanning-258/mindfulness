const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getPast7Days() {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

export default function MoodStrip({ moods = [] }) {
  const moodMap = Object.fromEntries(moods.map(m => [m.date, m]))
  const days = getPast7Days()

  return (
    <div className="flex justify-between gap-1 mb-4">
      {days.map(dateStr => {
        const d = new Date(dateStr + 'T00:00:00')
        const mood = moodMap[dateStr]
        return (
          <div key={dateStr} className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">{DAY_LABELS[d.getDay()]}</span>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
              style={mood
                ? { background: '#fce7f3', border: '2px solid #f9a8d4' }
                : { border: '2px dashed #d1d5db', background: 'transparent' }
              }
            >
              {mood ? mood.emoji : ''}
            </div>
          </div>
        )
      })}
    </div>
  )
}
