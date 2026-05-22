import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Users, BookOpen, Mail, Calendar, Trash2 } from 'lucide-react'

function AdminApprenants() {
  const { darkMode } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users')
      setUsers(response.data)
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDeleteUser = async (id: string, nom: string) => {
    if (!confirm(`Supprimer l'apprenant "${nom}" et toutes ses données ?`)) return
    try {
      await api.delete(`/auth/users/${id}`)
      setMessage(`Apprenant "${nom}" supprimé ✅`)
      fetchUsers()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage('Erreur: ' + err.response?.data?.message)
    }
  }

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Gestion des <span className="text-orange-500">apprenants</span>
        </h1>
        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {users.length} apprenant(s) inscrit(s)
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Users size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total apprenants
            </p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {users.length}
          </p>
        </div>

        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <BookOpen size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Nouveaux ce mois
            </p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {users.filter((u: any) => {
              const date = new Date(u.created_at)
              const now = new Date()
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </div>
      </div>

      {/* Liste des apprenants */}
      <div className={`card rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Liste des apprenants
          </h2>
        </div>

        {loading ? (
          <div className="px-6 py-8">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users size={40} color="#f97316" className="mx-auto mb-3" />
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Aucun apprenant inscrit
            </p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Les apprenants apparaîtront ici après leur inscription
            </p>
          </div>
        ) : (
          <div className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
            {users.map((user: any) => (
              <div
                key={user.id}
                className={`flex items-center justify-between px-6 py-4`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.nom.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.nom}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail size={12} color={darkMode ? '#6b7280' : '#9ca3af'} />
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} color={darkMode ? '#6b7280' : '#9ca3af'} />
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id, user.nom)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminApprenants