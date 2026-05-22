import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { PlayCircle, CheckCircle } from 'lucide-react'

function CoursePlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { darkMode } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [checkingEnrollment, setCheckingEnrollment] = useState(true)
  const [progress, setProgress] = useState<any[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressTimer = useRef<any>(null)

  const iconColor = darkMode ? '#ffffff' : '#111827'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, enrollmentsRes, progressRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/courses/my/enrollments'),
          api.get('/courses/my/progress')
        ])
        setCourse(courseRes.data)
        const enrolledIds = enrollmentsRes.data.map((e: any) => e.cours_id)
        setIsEnrolled(enrolledIds.includes(id))
        setProgress(progressRes.data)
        if (courseRes.data.modules && courseRes.data.modules.length > 0) {
          const sorted = courseRes.data.modules.sort((a: any, b: any) => a.ordre - b.ordre)
          setSelectedModule(sorted[0])
        }
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
        setCheckingEnrollment(false)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    if (!selectedModule) return

    progressTimer.current = setInterval(async () => {
      if (videoRef.current) {
        const watched_seconds = Math.floor(videoRef.current.currentTime)
        const completed = videoRef.current.ended ||
          (videoRef.current.duration > 0 &&
            videoRef.current.currentTime / videoRef.current.duration > 0.9)

        try {
          await api.post('/courses/progress', {
            module_id: selectedModule.id,
            watched_seconds,
            completed
          })
          if (completed) {
            setProgress(prev => {
              const exists = prev.find((p: any) => p.module_id === selectedModule.id)
              if (exists) {
                return prev.map((p: any) =>
                  p.module_id === selectedModule.id ? { ...p, completed: true } : p
                )
              }
              return [...prev, { module_id: selectedModule.id, completed: true }]
            })
          }
        } catch (err) {
          console.error('Erreur progression:', err)
        }
      }
    }, 10000)

    return () => clearInterval(progressTimer.current)
  }, [selectedModule])

  const isModuleCompleted = (moduleId: string) => {
    return progress.some((p: any) => p.module_id === moduleId && p.completed)
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement du cours...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Cours introuvable.</p>
      </div>
    )
  }

  if (!checkingEnrollment && !isEnrolled) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <p className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Vous n'êtes pas inscrit à ce cours
        </p>
        <button
          onClick={() => navigate('/catalogue')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Voir le catalogue
        </button>
      </div>
    )
  }

  const modules = course.modules
    ? [...course.modules].sort((a: any, b: any) => a.ordre - b.ordre)
    : []

  const completedCount = modules.filter((m: any) => isModuleCompleted(m.id)).length
  const progressPercent = modules.length > 0
    ? Math.round((completedCount / modules.length) * 100)
    : 0

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      {/* Header du cours */}
      <div className={`px-10 py-6 border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        {course.image_url && (
          <img
            src={course.image_url}
            alt={course.titre}
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
        )}
        <span className="text-orange-500 text-xs font-semibold uppercase tracking-wide">
          {course.categorie}
        </span>
        <h1 className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {course.titre}
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {course.description}
        </p>

        {/* Barre de progression */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {completedCount}/{modules.length} leçons complétées
            </span>
            <span className="text-orange-500 font-semibold">{progressPercent}%</span>
          </div>
          <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div
              className="h-2 bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex">

        {/* Lecteur vidéo */}
        <div className="flex-1 p-6">
          {selectedModule ? (
            <>
              <div className="rounded-2xl overflow-hidden bg-black aspect-video mb-4">
                <video
                  ref={videoRef}
                  key={selectedModule.video_url}
                  src={selectedModule.video_url}
                  controls
                  className="w-full h-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedModule.titre}
                </h2>
                {isModuleCompleted(selectedModule.id) && (
                  <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                    <CheckCircle size={16} color="#22c55e" />
                    Leçon complétée
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={`rounded-2xl flex items-center justify-center aspect-video ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
              <p className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                Aucune vidéo disponible
              </p>
            </div>
          )}
        </div>

        {/* Liste des modules */}
        <div className={`w-80 border-l p-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Leçons du cours
          </h3>

          {modules.length === 0 ? (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Aucune leçon disponible
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {modules.map((module: any) => (
                <div
                  key={module.id}
                  onClick={() => setSelectedModule(module)}
                  className={`card flex items-center gap-3 p-3 rounded-xl border
                    ${selectedModule?.id === module.id
                      ? 'border-orange-500 bg-orange-500 bg-opacity-10'
                      : darkMode
                        ? 'border-gray-800 hover:border-orange-500'
                        : 'border-gray-200 hover:border-orange-500'
                    }
                  `}
                >
                  {isModuleCompleted(module.id)
                    ? <CheckCircle size={18} color="#22c55e" />
                    : selectedModule?.id === module.id
                      ? <PlayCircle size={18} color="#f97316" />
                      : <PlayCircle size={18} color={iconColor} />
                  }
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {module.titre}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CoursePlayer