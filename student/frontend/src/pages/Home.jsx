import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Header from '../components/Header'
import EventsCalendar from '../components/EventsCalendar'
import MoodTracker from '../components/MoodTracker'
import JournalSection from '../components/JournalSection'
import StatusScore from '../components/StatusScore'
import PersonalityCard from '../components/PersonalityCard'
import StreakCounter from '../components/StreakCounter'
import WardrobePanel from '../components/WardrobePanel'

export default function Home() {
  const navigate = useNavigate()
  const [mindtype, setMindtype] = useState(null)
  const [streak, setStreak] = useState(0)

  const studentId = parseInt(localStorage.getItem('student_id') || '1')

  useEffect(() => {
    fetch(`${API}/quiz/result?student_id=${studentId}`)
      .then(r => {
        if (r.status === 404) { setMindtype(null); return null }
        return r.json()
      })
      .then(data => { if (data) setMindtype(data) })
      .catch(() => {})

    fetch(`${API}/mood/streak?student_id=${studentId}`)
      .then(r => r.json())
      .then(data => setStreak(data.streak))
      .catch(() => {})
  }, [studentId])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-screen bg-[#f9fafb]">
      <Header />

      {/* LAYER 1 */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex-[3]">
          <PersonalityCard mindtype={mindtype} />
        </div>

        <div className="flex-[2] flex flex-col gap-4">
          <StreakCounter streak={streak} />

          <div
            className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/chat')}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-4xl animate-pulse">
              {mindtype ? mindtype.emoji : '🐾'}
            </div>
            <p className="text-sm font-medium text-pink-500">Chat with Mia!</p>
          </div>

          <WardrobePanel streak={streak} />
        </div>
      </div>

      {/* LAYER 2 */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6 items-stretch">
        <div className="flex-[3] flex flex-col gap-4">
          <EventsCalendar />
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <MoodTracker />
          </div>
        </div>

        <div className="flex-[2] flex flex-col">
          <JournalSection />
        </div>
      </div>

      {/* LAYER 3 */}
      <StatusScore />
    </div>
  )
}
