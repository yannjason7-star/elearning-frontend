import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import SidebarAdmin from './components/SidebarAdmin'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Catalogue from './pages/Catalogue'
import Dashboard from './pages/Dashboard'
import CoursePlayer from './pages/CoursePlayer'
import Admin from './pages/Admin'
import AdminCours from './pages/AdminCours'
import AdminLecons from './pages/AdminLecons'
import AdminApprenants from './pages/AdminApprenants'
import Progression from './pages/Progression'
import TempsEtude from './pages/TempsEtude'
import Profil from './pages/Profil'
import AdminProgression from './pages/AdminProgression'
import AdminTempsEtude from './pages/AdminTempsEtude'
function App() {
  const { user, darkMode } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Home />} />
      </Routes>
    )
  }

  if (user.role === 'admin') {
    return (
      <div className={`flex min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <SidebarAdmin />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Admin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/cours" element={<AdminCours />} />
            <Route path="/admin/cours/:id" element={<AdminLecons />} />
            <Route path="/admin/apprenants" element={<AdminApprenants />} />
            <Route path="/admin/progression" element={<AdminProgression />} />
            <Route path="/admin/temps-etude" element={<AdminTempsEtude />} />
            <Route path="*" element={<Admin />} />
          </Routes>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/catalogue" element={<ProtectedRoute><Catalogue /></ProtectedRoute>} />
          <Route path="/progression" element={<ProtectedRoute><Progression /></ProtectedRoute>} />
          <Route path="/temps-etude" element={<ProtectedRoute><TempsEtude /></ProtectedRoute>} />
          <Route path="/cours/:id" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}

export default App