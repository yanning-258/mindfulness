export default function StreakCounter({ streak }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-base font-semibold text-gray-700">
          {streak > 0 ? `${streak} day check-in streak` : 'Start your check-in streak!'}
        </h3>
        <span className="text-xs text-gray-400">Keep it going 🔥</span>
      </div>
      <p className="text-xs text-gray-400 mb-3">Mood log or journal entry counts.</p>

      {streak > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: streak }).map((_, i) => (
            <span key={i} className="text-2xl select-none leading-none">🔥</span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          Log a mood or journal entry today to start the streak.
        </p>
      )}
    </div>
  )
}
