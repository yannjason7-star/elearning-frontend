import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/login', formData)
      login(response.data.token, response.data.user)
      
      // Redirection selon le rôle
      if (response.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2">Connexion</h2>
        <p className="text-gray-400 mb-6">Bon retour sur ELearnPro</p>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="joel@email.com"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Mot de passe</label>
            <input
              type="password"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition mt-2"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-orange-500 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login