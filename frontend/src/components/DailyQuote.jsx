import goodmorning from '../assets/goodmorning.png'

const QUOTES = [
  "It's okay to not be okay — as long as you are not giving up.",
  "Be gentle with yourself. You are a child of the universe.",
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "Small steps in the right direction can turn out to be the biggest steps of your life.",
  "Self-care is not selfish. You cannot serve from an empty vessel.",
  "You don't have to see the whole staircase, just take the first step.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
]

const QUOTE = QUOTES[Math.floor(Math.random() * QUOTES.length)]

export default function DailyQuote() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm relative"
      style={{
        backgroundImage: `url(${goodmorning})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '200px',
      }}
    >
      <div className="absolute inset-0 bg-black/35 rounded-2xl" />
      <div className="relative z-10 p-6 flex flex-col justify-end h-full" style={{ minHeight: '200px' }}>
        <p className="text-white font-semibold text-base leading-relaxed drop-shadow text-center">
          "{QUOTE}"
        </p>
      </div>
    </div>
  )
}
