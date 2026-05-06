import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Header from '../components/Header'
import EventsCalendar from '../components/EventsCalendar'
import MoodTracker from '../components/MoodTracker'
import JournalSection from '../components/JournalSection'
import StatusScore from '../components/StatusScore'
import StreakCounter from '../components/StreakCounter'
import identityBanner from '../assets/404_horizontal.png'
import chatWithMia from '../assets/chat_with_mia.png'

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
          <img
            src={identityBanner}
            alt="MINDtype identity"
            className="w-full h-full object-cover rounded-2xl shadow-sm border border-gray-100"
          />
        </div>

        <div className="flex-[2] flex flex-col gap-4">
          <StreakCounter streak={streak} />

          <button
            onClick={() => navigate('/chat')}
            className="block w-full p-0 border-0 bg-transparent cursor-pointer hover:opacity-90 transition-opacity"
            aria-label="Chat with Mia"
          >
            <img
              src={chatWithMia}
              alt="Chat with Mia"
              className="w-full h-auto rounded-2xl shadow-sm"
            />
          </button>

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
