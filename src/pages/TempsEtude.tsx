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

function TempsEtude() {
  const { darkMode } = useAuth()
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/courses/my/progress')
        setProgress(response.data)
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [])

  // Temps total — somme de daily_seconds de toutes les entrées
  const totalSeconds = progress.reduce((acc: number, p: any) => acc + (p.daily_seconds || 0), 0)
  const totalHours = Math.floor(totalSeconds / 3600)
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
  const tempsTotal = totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`

  // Graphe par jour — 7 derniers jours
  const getTimeByDay = () => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const isoDate = date.toISOString().split('T')[0]
      const label = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })

      // Somme des daily_seconds pour ce jour
      const totalSec = progress
        .filter((p: any) => p.session_date === isoDate)
        .reduce((acc: number, p: any) => acc + (p.daily_seconds || 0), 0)

      last7Days.push({ date: label, minutes: Math.round(totalSec / 60) })
    }
    return last7Days
  }

  const chartData = getTimeByDay()
  const activeDays = chartData.filter(d => d.minutes > 0)
  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 0)
  const moyenneMinutes = activeDays.length > 0
    ? Math.round(activeDays.reduce((acc, d) => acc + d.minutes, 0) / activeDays.length)
    : 0

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Temps d'<span className="text-orange-500">étude</span>
      </h1>
      <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Suivez votre temps de formation par jour
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Temps total</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tempsTotal}</p>
        </div>
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Max par jour</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{maxMinutes}m</p>
        </div>
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Moyenne / jour actif</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{moyenneMinutes}m</p>
        </div>
      </div>

      {/* Graphe barres */}
      <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
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
    </div>
  )
}

export default TempsEtude