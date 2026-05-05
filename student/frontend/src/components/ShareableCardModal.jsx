import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'

export default function ShareableCardModal({ mindtype }) {
  const cardRef = useRef(null)
  const navigate = useNavigate()

  async function handleDownload() {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { useCORS: true })
    const link = document.createElement('a')
    link.download = `mindtype-${mindtype.code}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 px-4">
      <div
        ref={cardRef}
        className="w-[400px] h-[400px] bg-gradient-to-br from-pink-300 to-purple-400 rounded-3xl shadow-2xl flex flex-col items-center justify-between p-6 text-white"
      >
        <p className="text-sm font-medium tracking-wide opacity-90">✨ MINDfulness MINDtype ✨</p>

        <div className="flex items-center justify-center w-full" style={{ height: '160px' }}>
          <img
            src={`/mindtype-assets/${mindtype.code.toLowerCase()}.png`}
            alt={mindtype.animal}
            className="h-full object-contain"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div
            className="h-full w-40 rounded-2xl items-center justify-center text-5xl hidden"
            style={{ background: mindtype.color }}
          >
            {mindtype.emoji}
          </div>
        </div>

        <p className="text-6xl">{mindtype.emoji}</p>

        <p className="text-base font-bold text-center">
          {mindtype.code} — {mindtype.name}
        </p>

        <div className="grid grid-cols-3 gap-2 w-full">
          {mindtype.traits.map((t, i) => (
            <div
              key={i}
              className="bg-white/20 rounded-full px-2 py-1 text-xs text-center font-medium"
            >
              {t.emoji} {t.label}
            </div>
          ))}
        </div>

        <p className="text-xs opacity-70">mindfulness.imperial.ac.uk</p>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="px-6 py-2.5 bg-white text-purple-600 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors shadow"
        >
          Download Card
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow"
        >
          Let's go! →
        </button>
      </div>
    </div>
  )
}
