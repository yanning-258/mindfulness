import Header from '../components/Header'
import EventsCalendar from '../components/EventsCalendar'
import MoodTracker from '../components/MoodTracker'
import JournalSection from '../components/JournalSection'
import DailyQuote from '../components/DailyQuote'
import StatusScore from '../components/StatusScore'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9fafb] px-4 py-6 max-w-6xl mx-auto">
      <Header />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT COLUMN — 60% */}
        <div className="flex-[3] w-full space-y-6">
          <EventsCalendar />
          <MoodTracker />
          <JournalSection />
        </div>

        {/* RIGHT COLUMN — 40% */}
        <div className="flex-[2] w-full space-y-6">
          <DailyQuote />
          <StatusScore />
        </div>
      </div>
    </div>
  )
}
