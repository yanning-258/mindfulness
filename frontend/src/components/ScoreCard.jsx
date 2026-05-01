function ScoreBar({ value, max, colorClass }) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`h-2 rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

const STATUS_STYLES = {
  Normal: 'text-green-700 bg-green-50 border-green-200',
  'Needs Attention': 'text-amber-700 bg-amber-50 border-amber-200',
  'High Risk': 'text-red-700 bg-red-50 border-red-200',
}

export default function ScoreCard({ score }) {
  if (!score) {
    return <p className="text-gray-400 text-sm">Loading your score…</p>
  }

  const statusStyle = STATUS_STYLES[score.overall_status] || 'text-gray-600 bg-gray-50 border-gray-200'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-700">Your Status Score</h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyle}`}>
          {score.overall_status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1.5">
            <span>PHQ-9 (Depression)</span>
            <span className="font-medium">{score.phq9_score} / 27</span>
          </div>
          <ScoreBar value={score.phq9_score} max={27} colorClass="bg-purple-400" />
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1.5">
            <span>GAD-7 (Anxiety)</span>
            <span className="font-medium">{score.gad7_score} / 21</span>
          </div>
          <ScoreBar value={score.gad7_score} max={21} colorClass="bg-pink-400" />
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1.5">
            <span>Suicidal Risk</span>
            <span className="font-medium">{score.suicidal_score} / 100</span>
          </div>
          <ScoreBar value={score.suicidal_score} max={100} colorClass="bg-red-400" />
        </div>
      </div>

      <p className="text-xs text-gray-400">Scores are calculated by the MINDfulness analytics engine</p>
    </div>
  )
}
