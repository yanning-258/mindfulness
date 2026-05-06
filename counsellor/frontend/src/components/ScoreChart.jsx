import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const SERIES = [
  { key: 'suicidal_score', label: 'Suicidal', color: '#f97316', max: 100 },
  { key: 'phq9_score',     label: 'PHQ-9',    color: '#3b82f6', max: 27  },
  { key: 'gad7_score',     label: 'GAD-7',    color: '#22c55e', max: 21  },
]

const TABS = [
  ...SERIES.map(s => ({ ...s, type: 'single' })),
  { key: 'all', label: 'All', color: '#6b7280', type: 'overlay' },
]

export default function ScoreChart({ scores = [] }) {
  const [activeTab, setActiveTab] = useState(TABS[0])

  const overlayData = useMemo(() => (
    scores.map(row => ({
      ...row,
      suicidal_pct: row.suicidal_score != null ? (row.suicidal_score / 100) * 100 : null,
      phq9_pct:     row.phq9_score     != null ? (row.phq9_score / 27)     * 100 : null,
      gad7_pct:     row.gad7_score     != null ? (row.gad7_score / 21)     * 100 : null,
    }))
  ), [scores])

  const isOverlay = activeTab.type === 'overlay'

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="font-bold text-gray-800 tracking-wide mb-3">SCORE OVER TIME</h2>

      <div className="flex gap-2 mb-5 flex-wrap">
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
        <LineChart
          data={isOverlay ? overlayData : scores}
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="computed_at"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={isOverlay ? [0, 100] : [0, activeTab.max]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickCount={6}
            tickFormatter={isOverlay ? v => `${v}%` : undefined}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(value, name, item) => {
              if (!isOverlay) return [value, activeTab.label]
              const series = SERIES.find(s => `${s.label} (% of max)` === name)
              if (!series) return [value, name]
              const raw = item?.payload?.[series.key]
              return [`${Math.round(value)}%  (${raw}/${series.max})`, series.label]
            }}
          />
          {isOverlay && <Legend wrapperStyle={{ fontSize: 12 }} />}

          {isOverlay ? (
            SERIES.map(s => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={`${s.key.split('_')[0]}_pct`}
                name={`${s.label} (% of max)`}
                stroke={s.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: s.color, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            ))
          ) : (
            <Line
              key={activeTab.key}
              type="monotone"
              dataKey={activeTab.key}
              stroke={activeTab.color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: activeTab.color, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
