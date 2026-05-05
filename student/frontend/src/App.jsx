import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import MoodStats from './pages/MoodStats'
import JournalMore from './pages/JournalMore'
import Login from './pages/Login'
import Quiz from './pages/Quiz'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/mood-stats" element={<ProtectedRoute><MoodStats /></ProtectedRoute>} />
        <Route path="/journal-more" element={<ProtectedRoute><JournalMore /></ProtectedRoute>} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  )
}
