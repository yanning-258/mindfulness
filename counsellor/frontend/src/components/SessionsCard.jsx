import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function SessionsCard() {
  const [sessions, setSessions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/sessions`)
      .then(r => r.json())
      .then(setSessions)
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow p-6 h-full">
      <h2 className="text-center font-bold text-gray-800 tracking-wide mb-4">UPCOMING COUNSELLING SESSIONS</h2>
      <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[320px]">
        <thead>
          <tr className="text-left border-b border-gray-100">
            <th className="pb-2 font-medium text-gray-400">Student</th>
            <th className="pb-2 font-medium text-gray-400">Date &amp; Time</th>
            <th className="pb-2 font-medium text-gray-400">Venue</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className="py-3 text-gray-800 font-medium">{s.student_name}</td>
              <td className="py-3 text-gray-700">{s.date} · {s.time}</td>
              <td className="py-3 text-gray-700">{s.venue}</td>
              <td className="py-3 text-right">
                <button
                  onClick={() => navigate(`/student/${s.student_id}`)}
                  className="bg-[#e9d5ff] text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-colors whitespace-nowrap"
                >
                  Student Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
