import { useState, useEffect } from 'react'

const MILESTONES = [
  { day: 1,  emoji: '🎀', label: 'Pink bow' },
  { day: 3,  emoji: '👒', label: 'Sun hat' },
  { day: 7,  emoji: '🧣', label: 'Cozy scarf' },
  { day: 14, emoji: '🏠', label: 'Cozy room' },
  { day: 30, emoji: '👑', label: 'Crown' },
]

export default function WardrobePanel({ streak }) {
  const [equipped, setEquipped] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('equipped_item')
    if (saved) setEquipped(JSON.parse(saved))
  }, [])

  function equip(item) {
    localStorage.setItem('equipped_item', JSON.stringify(item))
    setEquipped(item)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Mia's Wardrobe 👗</h3>

      <div className="flex justify-between gap-2">
        {MILESTONES.map(item => {
          const unlocked = streak >= item.day
          const isEquipped = equipped && equipped.day === item.day
          return (
            <button
              key={item.day}
              onClick={() => unlocked && equip(item)}
              disabled={!unlocked}
              className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${
                unlocked
                  ? 'cursor-pointer hover:bg-pink-50'
                  : 'cursor-default opacity-40'
              } ${isEquipped ? 'bg-pink-50 ring-1 ring-pink-300' : ''}`}
            >
              <span className={`text-2xl ${unlocked ? '' : 'grayscale'}`}>{item.emoji}</span>
              <span className="text-xs text-center leading-tight">
                {unlocked
                  ? isEquipped ? <span className="text-pink-600 font-medium">Equipped ✓</span> : item.label
                  : `Day ${item.day}`}
              </span>
            </button>
          )
        })}
      </div>

      {equipped && (
        <p className="text-xs text-gray-500 mt-3">
          Wearing: {equipped.emoji} {equipped.label}
        </p>
      )}
    </div>
  )
}
