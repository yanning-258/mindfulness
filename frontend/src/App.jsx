import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import MoodStats from './pages/MoodStats'
import JournalMore from './pages/JournalMore'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/mood-stats" element={<MoodStats />} />
        <Route path="/journal-more" element={<JournalMore />} />
      </Routes>
    </BrowserRouter>
  )
}
