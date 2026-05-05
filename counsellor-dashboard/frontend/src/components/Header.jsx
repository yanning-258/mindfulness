export default function Header({ title, avatar }) {
  return (
    <header className="bg-[#c4b5fd] rounded-b-3xl px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {avatar && (
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0"
            style={{ backgroundColor: avatar.color }}
          >
            {avatar.initials}
          </div>
        )}
        <h1 className="text-white text-lg sm:text-2xl font-bold truncate">{title}</h1>
      </div>
      <div className="text-right text-white flex-shrink-0">
        <p className="font-semibold text-sm sm:text-base hidden sm:block">Imperial College London</p>
        <p className="font-semibold text-xs sm:hidden">ICL</p>
        <p className="text-xs sm:text-sm opacity-90">Student Well-being Center</p>
      </div>
    </header>
  )
}
