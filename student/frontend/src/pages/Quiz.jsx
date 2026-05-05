import { useState } from 'react'
import API from '../api'
import ShareableCardModal from '../components/ShareableCardModal'

const QUESTIONS = [
  {
    text: "It's 11pm and your assignment is due tomorrow. You:",
    options: [
      { key: 'A', label: 'Already submitted it last week 🙂' },
      { key: 'B', label: 'Just started, no worries' },
      { key: 'C', label: 'What assignment??' },
      { key: 'D', label: 'Crying while eating instant noodles 😭' },
    ],
  },
  {
    text: 'Your friend needs £50. You:',
    options: [
      { key: 'A', label: 'Send it immediately, no questions 💳' },
      { key: 'B', label: "I'm also broke sorry" },
      { key: 'C', label: "Pretend you didn't see the message" },
      { key: 'D', label: 'Send it but screenshot it for memories' },
    ],
  },
  {
    text: 'How do you handle stress?',
    options: [
      { key: 'A', label: 'Sleep through it 😴' },
      { key: 'B', label: 'Retail therapy — buy something' },
      { key: 'C', label: 'Tell everyone about it' },
      { key: 'D', label: 'Bottle it up and explode later' },
    ],
  },
]

function computeMindtype(answers) {
  const counts = { A: 0, B: 0, C: 0, D: 0 }
  answers.forEach(a => counts[a]++)
  const top = Object.entries(counts).sort((x, y) => y[1] - x[1])[0][0]
  if (top === 'A') return 'ZZZ'
  if (top === 'B' && answers[1] === 'A') return 'ATM'
  if (top === 'C') return 'MAIN'
  if (top === 'D') return 'TOFU'
  return '404'
}

const MINDTYPE_META = {
  ATM: { name: 'The Generous Lover', animal: 'Pig', emoji: '🐷', color: '#f9a8d4', traits: [{ emoji: '💳', label: 'Generous' }, { emoji: '💞', label: 'Gift-giver' }, { emoji: '😅', label: 'Chaotic' }, { emoji: '🤗', label: 'People-pleaser' }, { emoji: '✨', label: 'Magnetic' }, { emoji: '😭', label: 'Overwhelmed' }], quote: 'You give love like a vending machine — endlessly.' },
  ZZZ: { name: 'The Unbothered One', animal: 'Cow', emoji: '🐮', color: '#bbf7d0', traits: [{ emoji: '😴', label: 'Unbothered' }, { emoji: '🌿', label: 'Chill' }, { emoji: '🤷', label: 'Go-with-flow' }, { emoji: '💤', label: 'Sleep-lover' }, { emoji: '🧘', label: 'Peaceful' }, { emoji: '😶', label: 'Hard to read' }], quote: 'Stress? Never heard of her.' },
  '404': { name: 'The Chaos Gremlin', animal: 'Raccoon', emoji: '🦝', color: '#e9d5ff', traits: [{ emoji: '🌙', label: 'Night owl' }, { emoji: '🗑️', label: 'Dumpster diver' }, { emoji: '⚡', label: 'Impulsive' }, { emoji: '😈', label: 'Chaotic' }, { emoji: '🎲', label: 'Unpredictable' }, { emoji: '🤌', label: 'Somehow survives' }], quote: 'Submitted at 11:59pm. Got a distinction.' },
  TOFU: { name: 'The Soft Overthinker', animal: 'Sheep', emoji: '🐑', color: '#fef3c7', traits: [{ emoji: '💭', label: 'Overthinks' }, { emoji: '🥺', label: 'Sensitive' }, { emoji: '📖', label: 'Studious' }, { emoji: '😰', label: 'Anxious' }, { emoji: '🤍', label: 'Kind' }, { emoji: '🌧️', label: 'Feels deeply' }], quote: 'You felt that email was passive aggressive. It was.' },
  MAIN: { name: 'The Delusional Optimist', animal: 'Fox', emoji: '🦊', color: '#fed7aa', traits: [{ emoji: '✨', label: 'Main character' }, { emoji: '🌈', label: 'Optimistic' }, { emoji: '🎭', label: 'Dramatic' }, { emoji: '💅', label: 'Confident' }, { emoji: '🚀', label: 'Dreamer' }, { emoji: '😅', label: 'Delusional' }], quote: "It will work out. It always does. (It doesn't.)" },
}

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [mindtype, setMindtype] = useState(null)

  async function handleAnswer(key) {
    const newAnswers = [...answers, key]

    if (newAnswers.length < QUESTIONS.length) {
      setAnswers(newAnswers)
      setCurrentQ(currentQ + 1)
      return
    }

    const code = computeMindtype(newAnswers)
    const studentId = parseInt(localStorage.getItem('student_id'))

    await fetch(`${API}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, mindtype_code: code }),
    })

    setMindtype({ code, ...MINDTYPE_META[code] })
  }

  const progress = ((currentQ) / QUESTIONS.length) * 100
  const question = QUESTIONS[currentQ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center px-4">
      {!mindtype && (
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <p className="text-center text-sm text-purple-500 font-medium mb-2">
              Question {currentQ + 1} of {QUESTIONS.length}
            </p>
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map(opt => (
              <button
                key={opt.key}
                onClick={() => handleAnswer(opt.key)}
                className="w-full text-left px-5 py-4 bg-white rounded-2xl shadow-sm border border-purple-100 text-gray-700 font-medium hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <span className="font-bold text-purple-400 mr-2">{opt.key})</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mindtype && <ShareableCardModal mindtype={mindtype} />}
    </div>
  )
}
