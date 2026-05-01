import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const OPENING = { id: 'open', sender: 'mia', text: 'Hi Angela! How are you today? 😊' }

function TypingIndicator() {
  return (
    <div className="flex justify-start items-end gap-2">
      <span className="text-2xl">🐶</span>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 150, 300].map(delay => (
            <span
              key={delay}
              className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Bubble({ msg }) {
  const isStudent = msg.sender === 'student'
  return (
    <div className={`flex items-end gap-2 ${isStudent ? 'justify-end' : 'justify-start'}`}>
      {!isStudent && <span className="text-2xl flex-shrink-0">🐶</span>}
      <div
        className={`max-w-sm text-sm leading-relaxed px-4 py-3 rounded-2xl
          ${isStudent
            ? 'bg-purple-500 text-white rounded-br-sm'
            : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm shadow-sm'}`}
      >
        {msg.text}
      </div>
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([OPENING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { id: Date.now(), sender: 'student', text }

    // Build history from all messages except the auto-opening one
    const history = messages
      .filter(m => m.id !== 'open')
      .map(m => ({ role: m.sender === 'student' ? 'user' : 'model', text: m.text }))

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'mia', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'mia',
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      }])
    } finally {
      setLoading(false)
    }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-400 px-6 py-4 flex items-center gap-3 shadow-sm flex-shrink-0">
        <Link to="/" className="text-white/80 hover:text-white text-sm transition-colors">← Back</Link>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl">🐶</span>
          <div>
            <p className="text-white font-semibold leading-tight">Chat with Mia</p>
            <p className="text-white/70 text-xs">Your mental wellness companion</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-gray-100 flex-shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Message Mia…"
              disabled={loading}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-semibold hover:bg-purple-600 disabled:opacity-40 transition-colors"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Mia is not a substitute for professional help. In a crisis, contact your university counselling service.
          </p>
        </div>
      </div>
    </div>
  )
}
