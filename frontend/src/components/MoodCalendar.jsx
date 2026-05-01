const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function MoodCalendar({ moods }) {
  const today = new Date()

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d
  })

  const moodMap = {}
  moods.forEach(m => { moodMap[m.date] = m })

  return (
    <div className="flex gap-2 justify-between">
      {days.map((day, i) => {
        const dateStr = day.toISOString().split('T')[0]
        const mood = moodMap[dateStr]
        const isToday = i === 6

        return (
          <div
            key={dateStr}
            className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl flex-1
              ${isToday ? 'bg-purple-100 ring-2 ring-purple-300' : 'bg-gray-50'}`}
          >
            <span className="text-xs font-medium text-gray-500">{DAY_NAMES[day.getDay()]}</span>
            <span className="text-xs text-gray-400">{day.getDate()}</span>
            <span className="text-xl mt-1">{mood ? mood.emoji : '○'}</span>
          </div>
        )
      })}
    </div>
  )
}
