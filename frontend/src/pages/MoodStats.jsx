import { Link } from 'react-router-dom'

export default function MoodStats() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">📊</div>
      <h1 className="text-2xl font-bold text-purple-800 mb-2">Mood Statistics</h1>
      <p className="text-gray-500 mb-8">Coming soon — charts and trends of your mood over time.</p>
      <Link to="/" className="text-sm text-pink-500 hover:text-pink-600 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  )
}
