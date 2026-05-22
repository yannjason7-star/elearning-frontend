import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Clock, Users, TrendingUp } from 'lucide-react'

function AdminTempsEtude() {
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

  // Temps par jour
  const getTimeByDay = () => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const isoDate = date.toISOString().split('T')[0]
      const label = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
      const totalSec = allProgress
        .filter((p: any) => p.created_at?.startsWith(isoDate))
        .reduce((acc: number, p: any) => acc + (p.watched_seconds || 0), 0)
      last7Days.push({ date: label, minutes: Math.round(totalSec / 60) })
    }
    return last7Days
  }

  const chartData = getTimeByDay()
  const totalSeconds = allProgress.reduce((acc: number, p: any) => acc + (p.watched_seconds || 0), 0)
  const totalHours = Math.floor(totalSeconds / 3600)
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
  const tempsTotal = totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`
  const moyenneMinutes = users.length > 0
    ? Math.round(totalSeconds / 60 / users.length)
    : 0

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Temps d'<span className="text-orange-500">étude</span>
      </h1>
      <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Suivi du temps d'étude de tous les apprenants
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Clock size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Temps total</p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tempsTotal}</p>
        </div>

        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Moyenne / apprenant</p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{moyenneMinutes}m</p>
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
          Temps d'étude par jour (minutes) — 7 derniers jours
        </h2>
        {loading ? (
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} unit="m" />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#111827'
                }}
                formatter={(value: any) => [`${value} minutes`, "Temps d'étude"]}
              />
              <Bar dataKey="minutes" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tableau par apprenant */}
      <div className={`card rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Temps d'étude par apprenant
          </h2>
        </div>
        {loading ? (
          <div className="px-6 py-8">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
          </div>
        ) : (
          <div className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
            {users.map((user: any) => {
              const userSecs = allProgress
                .filter((p: any) => p.user_id === user.id)
                .reduce((acc: number, p: any) => acc + (p.watched_seconds || 0), 0)
              const userHours = Math.floor(userSecs / 3600)
              const userMins = Math.floor((userSecs % 3600) / 60)
              const userTemps = userHours > 0 ? `${userHours}h ${userMins}m` : `${userMins}m`

              return (
                <div key={user.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {user.nom.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.nom}
                    </p>
                  </div>
                  <span className="text-orange-500 font-bold text-sm">{userTemps}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminTempsEtude