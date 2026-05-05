import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PastEntriesModal from './PastEntriesModal'
import API from '../api'

export default function JournalSection({ onEntrySubmitted }) {
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length

  async function submit() {
    if (!text.trim()) return
    setSaving(true)
    await fetch(`${API}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    setText('')
    setSaving(false)
    setSaved(true)
    if (onEntrySubmitted) onEntrySubmitted()
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-700">My Journal</h2>
        <Link to="/journal-more" className="text-sm font-medium text-pink-500 hover:text-pink-600">
          More &gt;
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Sticky note */}
        <div className="flex-[2]">
          <div
            className="rounded-xl p-4"
            style={{
              background: '#fef3c7',
              boxShadow: '4px 4px 0px #f97316',
            }}
          >
            <div className="flex justify-between text-lg text-amber-400 mb-2 select-none">
              <span>✦</span><span>✦</span>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's on your mind?"
              rows={6}
              className="w-full resize-none bg-transparent border-none outline-none text-sm text-amber-900 placeholder-amber-300 leading-relaxed"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-amber-400">{wordCount} words</span>
              <button
                onClick={submit}
                disabled={saving || !text.trim()}
                className="px-4 py-1.5 bg-amber-400 text-white rounded-lg text-xs font-semibold hover:bg-amber-500 disabled:opacity-40 transition-colors"
              >
                {saving ? 'Saving…' : 'Submit ✓'}
              </button>
            </div>
            {saved && <p className="text-xs text-green-600 font-medium mt-1">Entry saved ✓</p>}
            <div className="flex justify-between text-lg text-amber-400 mt-2 select-none">
              <span>✦</span><span>✦</span>
            </div>
          </div>
        </div>

        {/* Mia panel */}
        <div className="flex-1 flex flex-col items-center gap-3 pt-2">
          {/* Thought bubble */}
          <button
            onClick={() => setShowModal(true)}
            className="relative w-full text-center rounded-2xl px-3 py-3 text-sm font-medium text-amber-800 hover:opacity-80 transition-opacity"
            style={{ background: '#fde68a' }}
          >
            <span className="text-base">✨</span> Click to see past entries <span className="text-base">✨</span>
            {/* Bubble tail */}
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '12px solid #fde68a',
              }}
            />
          </button>

          {/* Puppy */}
          <div className="text-6xl mt-3 select-none">🐶</div>

          {/* Chat link */}
          <button
            onClick={() => navigate('/chat')}
            className="text-xs text-pink-500 hover:text-pink-600 font-medium text-center leading-snug"
          >
            Click here to chat with Mia!
          </button>
        </div>
      </div>

      {showModal && <PastEntriesModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
