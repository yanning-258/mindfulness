export default function MoodCircle({ mood, onClick }) {
  if (mood) {
    return (
      <button
        onClick={onClick}
        className="w-16 h-16 rounded-full border-2 border-pink-400 bg-pink-50 flex items-center justify-center text-3xl transition-transform hover:scale-110 focus:outline-none"
        title={mood.mood_label}
      >
        {mood.emoji}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="w-16 h-16 rounded-full flex items-center justify-center transition-colors focus:outline-none group"
      style={{
        border: '2px dashed #d1d5db',
        background: 'transparent',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '2px solid #ec4899'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '2px dashed #d1d5db'
      }}
      title="Click to log mood"
    />
  )
}
