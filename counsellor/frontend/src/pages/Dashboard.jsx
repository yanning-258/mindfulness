import Header from '../components/Header'
import StatsCard from '../components/StatsCard'
import SessionsCard from '../components/SessionsCard'
import RiskScoreboard from '../components/RiskScoreboard'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f5f3ff]">
      <Header title="Welcome, Counsellor!" />
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <StatsCard />
          </div>
          <div className="lg:col-span-2">
            <SessionsCard />
          </div>
        </div>
        <RiskScoreboard />
      </div>
    </div>
  )
}
