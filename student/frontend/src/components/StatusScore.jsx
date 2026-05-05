import { useState, useEffect } from 'react'
import API from '../api'

const STATUS_BADGE = {
  Normal: 'bg-green-100 text-green-700',
  'Needs Attention': 'bg-amber-100 text-amber-700',
  'High Risk': 'bg-red-100 text-red-700',
}

function getDominantColor(score) {
  if (score.overall_status === 'Normal') {
    return { bar: 'bg-green-50 border-green-100', text: 'text-green-700' }
  }
  const ratios = [
    { key: 'suicidal', ratio: score.suicidal_score / 100 },
    { key: 'phq9',     ratio: score.phq9_score / 27 },
    { key: 'gad7',     ratio: score.gad7_score / 21 },
  ]
  const dominant = ratios.sort((a, b) => b.ratio - a.ratio)[0].key
  if (dominant === 'suicidal') return { bar: 'bg-red-50 border-red-100',   text: 'text-red-600' }
  if (dominant === 'phq9')     return { bar: 'bg-blue-50 border-blue-100', text: 'text-blue-600' }
  return                              { bar: 'bg-pink-50 border-pink-100', text: 'text-pink-600' }
}

export default function StatusScore() {
  const [score, setScore] = useState(null)

  useEffect(() => {
    fetch(`${API}/scores`)
      .then(r => r.json())
      .then(setScore)
      .catch(() => {})
  }, [])

  if (!score) return null

  const { bar, text } = getDominantColor(score)

  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl px-5 py-3 border ${bar}`}>
      <span className={`text-xs font-semibold uppercase tracking-wide ${text}`}>Your Scores</span>

      <span className="text-xs text-gray-600">
        Depression <span className="font-semibold text-gray-800">{score.phq9_score}</span>
        <span className="text-gray-400">/27</span>
      </span>

      <span className="text-xs text-gray-600">
        Anxiety <span className="font-semibold text-gray-800">{score.gad7_score}</span>
        <span className="text-gray-400">/21</span>
      </span>

      <span className="text-xs text-gray-600">
        Suicidal Risk <span className="font-semibold text-gray-800">{score.suicidal_score}</span>
        <span className="text-gray-400">/100</span>
      </span>

      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_BADGE[score.overall_status] || 'bg-gray-100 text-gray-600'}`}>
        {score.overall_status}
      </span>
    </div>
  )
}
