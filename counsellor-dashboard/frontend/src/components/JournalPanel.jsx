import MoodStrip from './MoodStrip'

export default function JournalPanel({ entries = [], moods = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
      <h2 className="font-bold text-gray-800 tracking-wide mb-4">JOURNAL</h2>

      <MoodStrip moods={moods} />

      <div
        className="overflow-y-scroll flex-1 pr-1"
        style={{ maxHeight: 240, scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
      >
        {entries.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No journal entries.</p>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="border-b border-gray-50 pb-3 last:border-0">
                <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{entry.text}</p>
                <p className="text-xs text-gray-400 mt-1 text-right">{entry.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
