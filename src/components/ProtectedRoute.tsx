import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default ProtectedRoute