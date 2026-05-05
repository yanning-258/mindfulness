import DailyQuote from './DailyQuote'

export default function PersonalityCard({ mindtype }) {
  if (!mindtype) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-4xl">
            🌱
          </div>
          <div>
            <p className="text-sm text-gray-400">Take the MINDtype quiz to discover your personality!</p>
          </div>
        </div>
        <DailyQuote />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="text-5xl">{mindtype.emoji}</span>
        <div>
          <p className="text-xl font-bold text-gray-800">{mindtype.mindtype_code}</p>
          <p className="text-sm text-gray-500">{mindtype.mindtype_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {mindtype.traits && mindtype.traits.map((trait, i) => (
          <span
            key={i}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-pink-50 text-pink-700 text-center"
          >
            {trait.emoji} {trait.label}
          </span>
        ))}
      </div>

      <DailyQuote />
    </div>
  )
}
