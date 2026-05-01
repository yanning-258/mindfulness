import { Link } from 'react-router-dom'

export default function Chat() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-400 px-6 py-4 flex items-center gap-3 shadow-sm">
        <Link to="/" className="text-white text-sm hover:opacity-80">← Back</Link>
        <span className="text-white font-semibold text-lg">Chat with Mia 🐶</span>
      </div>

      {/* Placeholder — real chat built in Phase 5 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-7xl">🐶</div>
        <h2 className="text-xl font-semibold text-purple-800">Mia is coming soon!</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          The chat interface will be built in Phase 5. For now, Mia is getting ready to listen. 🐾
        </p>
        <Link to="/" className="text-sm text-pink-500 hover:text-pink-600 font-medium mt-2">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
