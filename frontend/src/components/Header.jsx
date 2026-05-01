const TODAY = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
})

export default function Header() {
  return (
    <div
      className="w-full flex items-center justify-between px-8 py-5 rounded-2xl mb-6"
      style={{ background: '#f8d7da' }}
    >
      <div>
        <h1 className="text-2xl font-bold text-rose-800">Welcome, Angela! 👋</h1>
        <p className="text-sm text-rose-500 mt-0.5">{TODAY}</p>
      </div>
      <p className="text-lg font-semibold text-rose-700 hidden sm:block">MINDfulness matters!</p>
    </div>
  )
}
