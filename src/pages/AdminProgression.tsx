import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { TrendingUp, Users, BookOpen } from 'lucide-react'

function AdminProgression() {
  const { darkMode } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [allProgress, setAllProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, progressRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/admin/progression')
        ])
        setUsers(usersRes.data)
        setAllProgress(progressRes.data)
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Dédupliquer par module_id et user_id
  const uniqueProgress = Object.values(
    allProgress.reduce((acc: any, p: any) => {
      const key = `${p.user_id}_${p.module_id}`
      if (!acc[key] || new Date(p.created_at) > new Date(acc[key].created_at)) {
        acc[key] = p
      }
      return acc
    }, {})
  ) as any[]

  const totalCompleted = uniqueProgress.filter((p: any) => p.completed).length
  const totalLessons = uniqueProgress.length
  const globalPercent = totalLessons > 0
    ? Math.round((totalCompleted / totalLessons) * 100)
    : 0

  // Progression par jour (7 derniers jours)
  const getProgressByDay = () => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const isoDate = date.toISOString().split('T')[0]
      const label = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
      const count = uniqueProgress.filter((p: any) =>
        p.completed && p.created_at?.startsWith(isoDate)
      ).length
      last7Days.push({ date: label, leçons: count })
    }
    return last7Days
  }

  const chartData = getProgressByDay()

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Progression <span className="text-orange-500">globale</span>
      </h1>
      <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Suivi de la progression de tous les apprenants
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progression globale</p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{globalPercent}%</p>
          <div className={`w-full h-2 rounded-full mt-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div className="h-2 bg-orange-500 rounded-full" style={{ width: `${globalPercent}%` }} />
          </div>
        </div>

        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <BookOpen size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Leçons complétées</p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalCompleted}</p>
        </div>

        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Users size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Apprenants actifs</p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{users.length}</p>
        </div>
      </div>

      {/* Graphe */}
      <div className={`card rounded-2xl p-6 border mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h2 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Leçons complétées par jour (7 derniers jours)
        </h2>
        {loading ? (
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#111827'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="leçons" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tableau par apprenant */}
      <div className={`card rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Progression par apprenant
          </h2>
        </div>
        {loading ? (
          <div className="px-6 py-8">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Aucun apprenant inscrit</p>
          </div>
        ) : (
          <div className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
            {users.map((user: any) => {
              const userProgress = uniqueProgress.filter((p: any) => p.user_id === user.id)
              const userCompleted = userProgress.filter((p: any) => p.completed).length
              const userTotal = userProgress.length
              const userPercent = userTotal > 0 ? Math.round((userCompleted / userTotal) * 100) : 0

              return (
                <div key={user.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {user.nom.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.nom}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {userCompleted}/{userTotal} leçons complétées
                        </p>
                      </div>
                    </div>
                    <span className="text-orange-500 font-bold text-sm">{userPercent}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div
                      className="h-2 bg-orange-500 rounded-full transition-all"
                      style={{ width: `${userPercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProgression