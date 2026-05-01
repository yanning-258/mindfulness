import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Mood from './pages/Mood'
import Journal from './pages/Journal'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
