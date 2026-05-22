import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { User, Mail, Lock, Save } from 'lucide-react'

function Profil() {
  const { user, darkMode, login } = useAuth()
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    mot_de_passe: '',
    nouveau_mot_de_passe: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const iconColor = darkMode ? '#ffffff' : '#111827'

  const handleUpdate = async () => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const response = await api.put('/auth/profile', formData)
      login(localStorage.getItem('token')!, response.data)
      setMessage('Profil mis à jour avec succès ✅')
      setFormData(prev => ({ ...prev, mot_de_passe: '', nouveau_mot_de_passe: '' }))
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Mon <span className="text-orange-500">profil</span>
      </h1>
      <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Gérez vos informations personnelles
      </p>

      <div className="max-w-lg">

        {/* Avatar */}
        <div className={`card rounded-2xl p-6 border mb-6 flex items-center gap-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user?.nom?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {user?.nom}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {user?.email}
            </p>
            <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Formulaire */}
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Modifier mes informations
          </h2>

          {message && (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Nom complet
              </label>
              <div className="relative">
                <User size={16} color={darkMode ? '#6b7280' : '#9ca3af'} className="absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className={`w-full rounded-lg pl-9 pr-4 py-3 border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                />
              </div>
            </div>

            <div>
              <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} color={darkMode ? '#6b7280' : '#9ca3af'} className="absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full rounded-lg pl-9 pr-4 py-3 border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                />
              </div>
            </div>

            <div className={`border-t pt-4 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Changer le mot de passe (optionnel)
              </p>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Lock size={16} color={darkMode ? '#6b7280' : '#9ca3af'} className="absolute left-3 top-3.5" />
                  <input
                    type="password"
                    placeholder="Mot de passe actuel"
                    value={formData.mot_de_passe}
                    onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
                    className={`w-full rounded-lg pl-9 pr-4 py-3 border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                  />
                </div>
                <div className="relative">
                  <Lock size={16} color={darkMode ? '#6b7280' : '#9ca3af'} className="absolute left-3 top-3.5" />
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={formData.nouveau_mot_de_passe}
                    onChange={(e) => setFormData({ ...formData, nouveau_mot_de_passe: e.target.value })}
                    className={`w-full rounded-lg pl-9 pr-4 py-3 border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition mt-2"
            >
              <Save size={16} color="#ffffff" />
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profil