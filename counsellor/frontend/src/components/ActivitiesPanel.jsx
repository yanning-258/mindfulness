const ANGELA_ACTIVITIES = [
  {
    title: 'Preventing Burnout Workshop',
    date: '2026-05-14',
    venue: 'Online',
    status: 'Registered',
  },
  {
    title: 'Counselling Drop-in',
    date: '2026-05-10',
    venue: 'Student Hub',
    status: 'Registered',
  },
  {
    title: 'Mindfulness Workshop',
    date: '2026-05-03',
    venue: 'Online',
    status: 'Attended',
  },
  {
    title: 'Mental Wellness Session',
    date: '2026-04-26',
    venue: 'LCBS 300',
    status: 'Attended',
  },
  {
    title: 'Sleep & Study Balance Talk',
    date: '2026-05-24',
    venue: 'Business School Atrium',
    status: 'Registered',
  },
]

const STATUS_STYLES = {
  Registered: 'bg-purple-50 text-purple-700',
  Attended:   'bg-green-50 text-green-700',
  Missed:     'bg-red-50 text-red-700',
}

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function ActivitiesPanel({ studentId }) {
  const activities = Number(studentId) === 1 ? ANGELA_ACTIVITIES : []

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
      <h2 className="font-bold text-gray-800 tracking-wide mb-4">ACTIVITIES REGISTERED</h2>

      <div
        className="overflow-y-auto flex-1 pr-1"
        style={{ maxHeight: 320, scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
      >
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No activities registered yet.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="border-b border-gray-50 pb-3 last:border-0 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(a.date)} · {a.venue}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[a.status] || 'bg-gray-100 text-gray-600'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
