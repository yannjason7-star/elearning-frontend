import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { BookOpen, Users, TrendingUp, Clock } from 'lucide-react'

function Admin() {
  const { darkMode } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [allProgress, setAllProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, usersRes, statsRes, progressRes] = await Promise.all([
          api.get('/courses'),
          api.get('/auth/users'),
          api.get('/courses/admin/stats'),
          api.get('/admin/progression')
        ])
        setCourses(coursesRes.data)
        setUsers(usersRes.data)
        setStats(statsRes.data)
        setAllProgress(progressRes.data)
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Temps total global
  const totalSeconds = allProgress.reduce((acc: number, p: any) => acc + (p.daily_seconds || 0), 0)
  const totalHours = Math.floor(totalSeconds / 3600)
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
  const tempsTotal = totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`

  // Progression globale
  const uniqueTotal = [...new Set(allProgress.map((p: any) => `${p.user_id}_${p.module_id}`))]
  const uniqueCompleted = [...new Set(
    allProgress.filter((p: any) => p.completed).map((p: any) => `${p.user_id}_${p.module_id}`)
  )]
  const globalPercent = uniqueTotal.length > 0
    ? Math.round((uniqueCompleted.length / uniqueTotal.length) * 100)
    : 0

  const dashboardStats = [
    { label: 'Cours créés', value: courses.length, icon: BookOpen },
    { label: 'Apprenants inscrits', value: users.length, icon: Users },
    { label: 'Progression globale', value: `${globalPercent}%`, icon: TrendingUp },
    { label: "Temps d'étude total", value: tempsTotal, icon: Clock },
  ]

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Tableau de <span className="text-orange-500">bord</span>
        </h1>
        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Vue d'ensemble de votre plateforme
        </p>
      </div>

      {loading ? (
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Icon size={18} color="#ffffff" />
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stat.label}
                  </p>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value as any}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Derniers cours */}
      <div className={`card rounded-2xl p-6 border mb-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Derniers cours créés
        </h2>
        {courses.length === 0 ? (
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Aucun cours créé pour le moment.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <BookOpen size={16} color="#ffffff" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {course.titre}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {course.categorie}
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                  {stats[course.id] || 0} apprenant(s)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Derniers apprenants */}
      <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Derniers apprenants inscrits
        </h2>
        {users.length === 0 ? (
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Aucun apprenant inscrit pour le moment.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}
              >
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
                      {user.email}
                    </p>
                  </div>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin