import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { BookOpen, TrendingUp, Clock, PlayCircle } from 'lucide-react'

function Dashboard() {
  const { user, darkMode } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollmentsRes, progressRes] = await Promise.all([
          api.get('/courses/my/enrollments'),
          api.get('/courses/my/progress')
        ])
        setEnrollments(enrollmentsRes.data)
        setProgress(progressRes.data)
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Dédupliquer par module_id — garder la plus récente
  const uniqueProgress = Object.values(
    progress.reduce((acc: any, p: any) => {
      if (!acc[p.module_id] || new Date(p.created_at) > new Date(acc[p.module_id].created_at)) {
        acc[p.module_id] = p
      }
      return acc
    }, {})
  ) as any[]

  // Progression
  const completedLessons = uniqueProgress.filter((p: any) => p.completed).length
  const totalLessons = uniqueProgress.length
  const progressPercent = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0

  // Temps total — somme de TOUS les temps sur toutes les entrées uniques
  const totalByModule: { [key: string]: number } = {}
  progress.forEach((p: any) => {
    if (!totalByModule[p.module_id] || p.watched_seconds > totalByModule[p.module_id]) {
      totalByModule[p.module_id] = p.watched_seconds || 0
    }
  })
 // Temps total — somme de daily_seconds de toutes les entrées
  const totalSeconds = progress.reduce((acc: number, p: any) => acc + (p.daily_seconds || 0), 0)
  const totalHours = Math.floor(totalSeconds / 3600)
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
  const tempsEtude = totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`
  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Bonjour, <span className="text-orange-500">{user?.nom}</span>
      </h1>
      <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Bienvenue sur votre tableau de bord
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <BookOpen size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cours inscrits</p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {enrollments.length}
          </p>
        </div>

        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progression</p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {progressPercent}%
          </p>
          {totalLessons > 0 && (
            <div className="mt-2">
              <div className={`w-full h-1.5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div
                  className="h-1.5 bg-orange-500 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Clock size={18} color="#ffffff" />
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Temps d'étude</p>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {tempsEtude}
          </p>
        </div>
      </div>

      {/* Mes cours */}
      <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Mes cours
        </h2>

        {loading ? (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chargement...</p>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen size={40} color="#f97316" className="mx-auto mb-3" />
            <p className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Vous n'êtes inscrit à aucun cours
            </p>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Découvrez nos formations disponibles
            </p>
            <button
              onClick={() => navigate('/catalogue')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Voir le catalogue
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {enrollments.map((enrollment: any) => (
              <div
                key={enrollment.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <BookOpen size={18} color="#ffffff" />
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {enrollment.courses?.titre}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {enrollment.courses?.categorie}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/cours/${enrollment.cours_id}`)}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <PlayCircle size={14} color="#ffffff" />
                  Continuer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard