export default function StreakCounter({ streak }) {
  return (
    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-bold px-4 py-2 rounded-full border border-amber-100 w-fit">
      {streak > 0 ? `🔥 ${streak} day streak` : '🔥 Start your streak today!'}
    </div>
  )
}
