import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-gray-950 border-b border-gray-800">
      
      {/* Logo */}
      <h1 
        onClick={() => navigate('/')}
        className="text-2xl font-bold text-orange-500 cursor-pointer"
      >
        ELearnPro
      </h1>

      {/* Liens */}
      <div className="flex gap-8 text-gray-300">
        <span 
          onClick={() => navigate('/')}
          className="hover:text-white cursor-pointer"
        >
          Accueil
        </span>
        <span 
          onClick={() => navigate('/catalogue')}
          className="hover:text-white cursor-pointer"
        >
          Cours
        </span>
      </div>

      {/* Boutons dynamiques */}
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-gray-400 text-sm">
              Bonjour, <span className="text-white font-semibold">{user.nom}</span>
            </span>
            <button
              onClick={() => navigate('/dashboard')}
              className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Se connecter
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold transition"
            >
              S'inscrire
            </button>
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar