import { useState, useEffect } from 'react'
import API from '../api'

const STATS_CONFIG = [
  { key: 'normal',     label: 'Normal',         color: '#22c55e' },
  { key: 'anxiety',    label: 'Anxiety',         color: '#3b82f6' },
  { key: 'depression', label: 'Depression',      color: '#1f2937' },
  { key: 'suicidal',   label: 'Suicidal',        color: '#ef4444' },
]

export default function StatsCard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch(`${API}/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow p-6 h-full">
      <h2 className="text-center font-bold text-gray-800 tracking-wide mb-6">OVERALL STATISTICS</h2>
      <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-2">
        {STATS_CONFIG.map(({ key, label, color }) => (
          <div key={key} className="text-center flex-1 min-w-[60px]">
            <p className="text-2xl sm:text-3xl font-bold" style={{ color }}>
              {stats ? stats[key] : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
        <div className="text-center flex-1 min-w-[60px] border-l border-gray-200 pl-3 sm:pl-4 ml-1 sm:ml-2">
          <p className="text-3xl sm:text-4xl font-bold text-gray-800">
            {stats ? stats.total : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Students</p>
        </div>
      </div>
    </div>
  )
}
