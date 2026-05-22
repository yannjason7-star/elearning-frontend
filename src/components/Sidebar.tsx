import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import {
  Home,
  BookOpen,
  TrendingUp,
  Clock,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  User
} from 'lucide-react'
function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, darkMode, toggleTheme } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  const navItems = [
  { label: 'Accueil', icon: Home, path: '/' },
  { label: 'Cours', icon: BookOpen, path: '/catalogue' },
  { label: 'Progression', icon: TrendingUp, path: '/progression' },
  { label: 'Temps d\'étude', icon: Clock, path: '/temps-etude' },
  { label: 'Mon profil', icon: User, path: '/profil' },
]

  return (
    <div className={`flex flex-col justify-between h-screen sticky top-0 border-r transition-all duration-300
      ${collapsed ? 'w-16' : 'w-56'}
      ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
    `}>
      
      {/* Haut */}
      <div>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <GraduationCap className="text-orange-500 shrink-0" size={24} />
          {!collapsed && (
            <span className="text-orange-500 font-bold text-lg">ELearnPro</span>
          )}
        </div>

        {/* Nom utilisateur */}
        {!collapsed && (
          <div className={`px-4 py-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Connecté en tant que</p>
            <p className={`font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user?.nom}</p>
            <span className="text-xs bg-orange-500 bg-opacity-20 text-orange-500 px-2 py-0.5 rounded-full mt-1 inline-block">
              {user?.role}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="px-2 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition font-medium text-sm
                  ${isActive(item.path)
                    ? 'bg-orange-500 text-white'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bas */}
      <div className={`px-2 py-4 flex flex-col gap-1 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        
        {/* Thème */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition text-sm font-medium
            ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}
          `}
        >
          {darkMode ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
          {!collapsed && <span>{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
        </button>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition text-sm font-medium
            ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-red-400' : 'text-gray-600 hover:bg-gray-100 hover:text-red-500'}
          `}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>

        {/* Réduire */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition text-sm font-medium
            ${darkMode ? 'text-gray-500 hover:bg-gray-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100'}
          `}
        >
          {collapsed ? <ChevronRight size={18} className="shrink-0" /> : <ChevronLeft size={18} className="shrink-0" />}
          {!collapsed && <span>Réduire le menu</span>}
        </button>
      </div>

    </div>
  )
}

export default Sidebar