import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MoodStats from './pages/MoodStats'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f9fafb]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mood-stats" element={<MoodStats />} />
          {/* /chat added in Phase 5 */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}
