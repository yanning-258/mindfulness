import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import ScoreChart from '../components/ScoreChart'
import ActivitiesPanel from '../components/ActivitiesPanel'
import API from '../api'

const AVATAR_COLORS = ['#7c3aed', '#2563eb', '#059669', '#dc2626', '#d97706']

function getInitials(name = '') {
  const parts = name.split(' ')
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase()
}

export default function StudentProfile() {
  const { id } = useParams()
  const [profile,  setProfile]  = useState(null)
  const [scores,   setScores]   = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API}/student/${id}`).then(r => r.json()),
      fetch(`${API}/student/${id}/scores`).then(r => r.json()),
    ])
      .then(([p, s]) => { setProfile(p); setScores(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center text-gray-400">Loading…</div>
  }

  if (!profile || profile.detail) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Student not found.</p>
          <Link to="/" className="text-purple-600 hover:underline text-sm">← Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const color    = AVATAR_COLORS[(Number(id) - 1) % AVATAR_COLORS.length]
  const initials = getInitials(profile.name)

  return (
    <div className="min-h-screen bg-[#f5f3ff]">
      <Header
        title={profile.name}
        avatar={{ initials, color }}
      />

      <div className="max-w-7xl mx-auto px-6 py-4 space-y-5">
        <Link to="/" className="text-sm text-purple-600 hover:underline">← Back to Dashboard</Link>

        {/* Profile + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-800 tracking-wide mb-4">PROFILE</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-gray-400 w-20 flex-shrink-0">CID</dt>
                <dd className="text-gray-800 font-medium">{profile.cid ?? '—'}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-400 w-20 flex-shrink-0">Major</dt>
                <dd className="text-gray-800">{profile.major}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-400 w-20 flex-shrink-0">Year</dt>
                <dd className="text-gray-800">{profile.year}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-400 w-20 flex-shrink-0">Country</dt>
                <dd className="text-gray-800">{profile.country}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-800 tracking-wide mb-4">SUMMARY</h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Recent journal entries reflect significant emotional distress, negative self-perception, and hopelessness.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-bold text-gray-800">Last action: </span>
              Check-in sent (Mar 10, 2026); no response received.
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-800">Recommendation: </span>
              Immediate follow-up; consider escalation to counselling.
            </p>
          </div>
        </div>

        {/* Chart + Journal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ScoreChart scores={scores} />
          <ActivitiesPanel studentId={id} />
        </div>
      </div>
    </div>
  )
}
