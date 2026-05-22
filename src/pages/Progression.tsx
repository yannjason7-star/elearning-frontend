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
  ResponsiveContainer
} from 'recharts'

function Progression() {
  const { darkMode } = useAuth()
  const [progress, setProgress] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openCours, setOpenCours] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, enrollmentsRes] = await Promise.all([
          api.get('/courses/my/progress'),
          api.get('/courses/my/enrollments')
        ])
        setProgress(progressRes.data)
        setEnrollments(enrollmentsRes.data)
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Grouper la progression par jour
  const getProgressByDay = () => {
    const days: { [key: string]: number } = {}
    const last7Days = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const key = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
      days[date.toISOString().split('T')[0]] = 0
      last7Days.push({ date: key, isoDate: date.toISOString().split('T')[0] })
    }

    // Dédupliquer par module_id — garder seulement le plus récent
    const uniqueProgress = Object.values(
      progress.reduce((acc: any, p: any) => {
        if (!acc[p.module_id] || new Date(p.created_at) > new Date(acc[p.module_id].created_at)) {
          acc[p.module_id] = p
        }
        return acc
      }, {})
    )

    uniqueProgress.forEach((p: any) => {
      if ((p as any).completed && (p as any).created_at) {
        const date = new Date((p as any).created_at).toISOString().split('T')[0]
        if (days[date] !== undefined) {
          days[date] += 1
        }
      }
    })

    return last7Days.map(day => ({
      date: day.date,
      leçons: days[day.isoDate] || 0
    }))
  }

  // Dédupliquer les progressions par module_id
  const uniqueProgress = Object.values(
    progress.reduce((acc: any, p: any) => {
      if (!acc[p.module_id] || new Date(p.created_at) > new Date(acc[p.module_id].created_at)) {
        acc[p.module_id] = p
      }
      return acc
    }, {})
  ) as any[]

  // Grouper les leçons par cours
  const progressByCours = enrollments.map((enrollment: any) => {
    const coursModules = uniqueProgress.filter((p: any) =>
      p.modules?.cours_id === enrollment.cours_id
    )
    const completed = coursModules.filter((p: any) => p.completed).length
    const total = coursModules.length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      cours: enrollment.courses,
      cours_id: enrollment.cours_id,
      modules: coursModules,
      completed,
      total,
      percent
    }
  })

  const chartData = getProgressByDay()
  const totalCompleted = uniqueProgress.filter((p: any) => p.completed).length
  const totalLessons = uniqueProgress.length
  const globalPercent = totalLessons > 0
    ? Math.round((totalCompleted / totalLessons) * 100)
    : 0

  const toggleCours = (coursId: string) => {
    setOpenCours(prev =>
      prev.includes(coursId)
        ? prev.filter(id => id !== coursId)
        : [...prev, coursId]
    )
  }

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Ma <span className="text-orange-500">progression</span>
      </h1>
      <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Suivez votre avancement dans les cours
      </p>

      {/* Stats globales */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progression globale</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{globalPercent}%</p>
          <div className={`w-full h-2 rounded-full mt-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div
              className="h-2 bg-orange-500 rounded-full transition-all"
              style={{ width: `${globalPercent}%` }}
            />
          </div>
        </div>
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Leçons complétées</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalCompleted}</p>
        </div>
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total leçons</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalLessons}</p>
        </div>
      </div>

      {/* Graphe progression */}
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
              <Line type="monotone" dataKey="leçons" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Détail par cours */}
      <div className="flex flex-col gap-4">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Détail par cours
        </h2>
        {loading ? (
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
        ) : progressByCours.length === 0 ? (
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Aucune progression enregistrée.
          </p>
        ) : (
          progressByCours.map((item: any) => (
            <div
              key={item.cours_id}
              className={`card rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              {/* Header cours — cliquable */}
              <div
                onClick={() => toggleCours(item.cours_id)}
                className="flex items-center justify-between px-6 py-4 cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.cours?.titre || 'Cours'}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-500 font-semibold text-sm">
                        {item.percent}%
                      </span>
                      <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {openCours.includes(item.cours_id) ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div
                      className="h-2 bg-orange-500 rounded-full transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {item.completed}/{item.total} leçons complétées
                  </p>
                </div>
              </div>

              {/* Liste des leçons — masquable */}
              {openCours.includes(item.cours_id) && (
                <div className={`border-t px-6 py-4 flex flex-col gap-2 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                  {item.modules.length === 0 ? (
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Aucune leçon commencée dans ce cours.
                    </p>
                  ) : (
                    item.modules.map((p: any) => (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}
                      >
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {p.modules?.titre || 'Leçon'}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date(p.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap ${p.completed ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                          {p.completed ? '✓ Complétée' : '⏳ En cours'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Progression