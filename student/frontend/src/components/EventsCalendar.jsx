import { useState, useEffect } from 'react'
import API from '../api'

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function EventsCalendar() {
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const todayStr = now.toISOString().split('T')[0]

  useEffect(() => {
    fetch(`${API}/events`)
      .then(r => r.json())
      .then(setEvents)
      .catch(() => {})
  }, [])

  const eventMap = {}
  events.forEach(e => { eventMap[e.date] = e })

  const nextEvent = events.find(e => e.date >= todayStr)

  // Build calendar grid (Monday-first)
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const mondayOffset = (firstDayOfMonth + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array(mondayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const monthLabel = new Date(year, month).toLocaleDateString('en-GB', {
    month: 'long', year: 'numeric',
  })

  function handleDayClick(dateStr) {
    if (!eventMap[dateStr]) return
    setSelectedDate(selectedDate === dateStr ? null : dateStr)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Next session banner */}
      {nextEvent && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            🕐 Next session: <span className="font-semibold text-purple-700">{nextEvent.title}</span>
            {' — '}{formatDisplay(nextEvent.date)} at {nextEvent.time}
          </p>
          <a href="#" className="text-xs text-purple-400 hover:text-purple-600 hover:underline mt-0.5 inline-block">
            Click to see it on Microsoft Calendar →
          </a>
        </div>
      )}

      {/* Month label */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{monthLabel}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
          event
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 relative">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="py-1" />

          const dateStr = toDateStr(year, month, day)
          const event = eventMap[dateStr]
          const isToday = dateStr === todayStr

          return (
            <div
              key={dateStr}
              onClick={() => handleDayClick(dateStr)}
              className={`relative flex flex-col items-center py-1 rounded-lg
                ${event ? 'cursor-pointer hover:bg-pink-50' : ''}
                ${isToday ? 'bg-purple-50' : ''}`}
            >
              <span className={`text-xs leading-5 ${isToday ? 'font-bold text-purple-600' : 'text-gray-600'}`}>
                {day}
              </span>
              {event && (
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-0.5" />
              )}

              {/* Event popup */}
              {selectedDate === dateStr && (
                <div
                  className="absolute top-8 left-1/2 -translate-x-1/2 z-30 bg-white rounded-xl shadow-lg border border-purple-100 p-3 w-48 text-left"
                  onClick={e => e.stopPropagation()}
                >
                  <p className="text-xs font-semibold text-purple-700 leading-snug">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-1">🕐 {event.time}</p>
                  <p className="text-xs text-gray-500">📍 {event.venue}</p>
                  {event.description && (
                    <p className="text-xs text-gray-400 mt-1 leading-snug">{event.description}</p>
                  )}
                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-semibold text-white bg-purple-500 hover:bg-purple-600 rounded-md px-2.5 py-1.5"
                    >
                      Register →
                    </a>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
