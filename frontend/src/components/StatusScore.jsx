import { useState, useEffect } from 'react'
import API from '../api'

const STATUS_STYLES = {
  Normal: 'bg-green-100 text-green-700',
  'Needs Attention': 'bg-amber-100 text-amber-700',
  'High Risk': 'bg-red-100 text-red-700',
}

function ScoreRow({ label, value, max }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-800">
        <span className="text-lg text-gray-900">{String(value).padStart(2, '0')}</span>
        <span className="text-gray-400 font-normal"> /{max}</span>
      </span>
    </div>
  )
}

export default function StatusScore() {
  const [score, setScore] = useState(null)

  useEffect(() => {
    fetch(`${API}/scores`)
      .then(r => r.json())
      .then(setScore)
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-700">Your Status Score</h3>
        {score && (
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Overall</p>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[score.overall_status] || 'bg-gray-100 text-gray-600'}`}>
              {score.overall_status}
            </span>
          </div>
        )}
      </div>

      {!score && <p className="text-sm text-gray-400">Loading…</p>}

      {score && (
        <div>
          <ScoreRow label="Depression" value={score.phq9_score} max={27} />
          <ScoreRow label="Anxiety" value={score.gad7_score} max={21} />
          <ScoreRow label="Suicidal Risk" value={score.suicidal_score} max={100} />
          <p className="text-xs text-gray-400 mt-3">Scores calculated by the MINDfulness analytics engine</p>
        </div>
      )}
    </div>
  )
}
