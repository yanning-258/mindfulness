import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

const STATUS_STYLES = {
  Suicidal:   'bg-red-500 text-white',
  Depression: 'bg-gray-800 text-white',
  Anxiety:    'bg-blue-500 text-white',
  Normal:     'bg-green-500 text-white',
}

function DatabaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
    </svg>
  )
}

export default function RiskScoreboard() {
  const [students, setStudents] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/students`)
      .then(r => r.json())
      .then(setStudents)
      .catch(() => {})
  }, [])

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white flex-shrink-0">
          <DatabaseIcon />
        </div>
        <h2 className="font-bold text-gray-800 text-base tracking-wide">LIVE RISK SCOREBOARD</h2>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-5 py-3 w-14"></th>
              <th className="px-4 py-3 font-medium text-gray-400">Name</th>
              <th className="px-4 py-3 font-medium text-gray-400">PHQ-9 (out of 27)</th>
              <th className="px-4 py-3 font-medium text-gray-400">GAD-7 (out of 21)</th>
              <th className="px-4 py-3 font-medium text-gray-400">Suicidal Score (out of 100)</th>
              <th className="px-4 py-3 font-medium text-gray-400">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr
                key={student.id}
                className="border-b border-gray-50 last:border-0 hover:bg-purple-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: student.color }}
                  >
                    {student.initials}
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-gray-800">{student.name}</td>
                <td className="px-4 py-4 text-gray-600">{student.phq9_score}</td>
                <td className="px-4 py-4 text-gray-600">{student.gad7_score}</td>
                <td className="px-4 py-4 text-gray-600">{student.suicidal_score}</td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[student.overall_status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {student.overall_status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => navigate(`/student/${student.id}`)}
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
    </div>
  )
}
