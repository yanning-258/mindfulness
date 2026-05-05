import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Dot,
} from 'recharts'

const TABS = [
  { key: 'suicidal_score', label: 'Suicidal', color: '#f97316', domain: [0, 100] },
  { key: 'phq9_score',     label: 'PHQ-9',    color: '#3b82f6', domain: [0, 27]  },
  { key: 'gad7_score',     label: 'GAD-7',    color: '#22c55e', domain: [0, 21]  },
]

export default function ScoreChart({ scores = [] }) {
  const [activeTab, setActiveTab] = useState(TABS[0])

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="font-bold text-gray-800 tracking-wide mb-3">SCORE OVER TIME</h2>

      <div className="flex gap-2 mb-5">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={
              activeTab.key === tab.key
                ? { backgroundColor: tab.color, color: '#fff' }
                : { backgroundColor: '#f3f4f6', color: '#6b7280' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={scores} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="computed_at"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={activeTab.domain}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickCount={6}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={value => [value, activeTab.label]}
          />
          <Line
            key={activeTab.key}
            type="monotone"
            dataKey={activeTab.key}
            stroke={activeTab.color}
            strokeWidth={2.5}
            dot={{ r: 4, fill: activeTab.color, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
