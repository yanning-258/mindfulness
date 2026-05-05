import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import StudentProfile from './pages/StudentProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/student/:id" element={<StudentProfile />} />
      </Routes>
    </BrowserRouter>
  )
}
