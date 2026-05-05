import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  if (!localStorage.getItem('student_id')) {
    return <Navigate to="/login" replace />
  }
  return children
}
