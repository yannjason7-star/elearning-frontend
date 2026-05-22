import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { BookOpen, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

function Catalogue() {
  const navigate = useNavigate()
  const { darkMode } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [showMesCours, setShowMesCours] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get('/courses'),
          api.get('/courses/my/enrollments')
        ])
        setCourses(coursesRes.data)
        setEnrollments(enrollmentsRes.data)
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const enrolledIds = enrollments.map((e: any) => e.cours_id)
  const mesCours = courses.filter((c: any) => enrolledIds.includes(c.id))
  const autresCours = courses.filter((c: any) => !enrolledIds.includes(c.id))

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId)
    try {
      await api.post(`/courses/enroll/${courseId}`)
      const enrollmentsRes = await api.get('/courses/my/enrollments')
      setEnrollments(enrollmentsRes.data)
      setMessage('Inscription réussie ✅')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Erreur inscription')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setEnrolling(null)
    }
  }

  const handleUnenroll = async (courseId: string) => {
    if (!confirm('Se désinscrire de ce cours ?')) return
    try {
      await api.delete(`/courses/enroll/${courseId}`)
      const enrollmentsRes = await api.get('/courses/my/enrollments')
      setEnrollments(enrollmentsRes.data)
      setMessage('Désinscription réussie')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const CourseCard = ({ course, isEnrolled }: { course: any, isEnrolled: boolean }) => (
    <div className={`card rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>

      {/* Image ou bande orange */}
      {course.image_url ? (
        <div className="relative">
          <img
            src={course.image_url}
            alt={course.titre}
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 left-2 bg-orange-500 px-2 py-0.5 rounded-full">
            <span className="text-white text-xs font-semibold uppercase">
              {course.categorie}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-orange-500 px-4 py-2 flex items-center justify-between">
          <span className="text-white text-xs font-semibold uppercase tracking-wide">
            {course.categorie}
          </span>
          <BookOpen size={14} color="#ffffff" />
        </div>
      )}

      <div className="p-6">
        <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {course.titre}
        </h3>
        <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {course.modules?.length || 0} leçon(s)
        </p>
        <p className={`text-sm line-clamp-2 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {course.description}
        </p>

        {isEnrolled ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-green-500 text-sm font-medium mb-1">
              <CheckCircle size={16} color="#22c55e" />
              <span>Inscrit</span>
            </div>
            <button
              onClick={() => navigate(`/cours/${course.id}`)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
            >
              Continuer le cours
            </button>
            <button
              onClick={() => handleUnenroll(course.id)}
              className={`w-full py-2 rounded-lg text-sm font-medium border transition ${darkMode ? 'border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-500' : 'border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-500'}`}
            >
              Se désinscrire
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEnroll(course.id)}
            disabled={enrolling === course.id}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition"
          >
            {enrolling === course.id ? 'Inscription...' : "S'inscrire"}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Mes <span className="text-orange-500">formations</span>
      </h1>
      <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Gérez vos inscriptions et découvrez de nouvelles formations
      </p>

      {message && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      {loading ? (
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
      ) : (
        <>
          {/* Section Mes cours */}
          <div className={`card rounded-2xl border mb-8 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div
              onClick={() => setShowMesCours(!showMesCours)}
              className="flex items-center justify-between px-6 py-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Mes cours
                </h2>
                <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {mesCours.length}
                </span>
              </div>
              {showMesCours
                ? <ChevronUp size={20} color={darkMode ? '#9ca3af' : '#6b7280'} />
                : <ChevronDown size={20} color={darkMode ? '#9ca3af' : '#6b7280'} />
              }
            </div>

            {showMesCours && (
              <div className={`border-t px-6 py-6 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                {mesCours.length === 0 ? (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Vous n'êtes inscrit à aucun cours. Inscrivez-vous ci-dessous.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mesCours.map((course) => (
                      <CourseCard key={course.id} course={course} isEnrolled={true} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section Tous les cours */}
          <div>
            <h2 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Tous les cours disponibles
              <span className={`text-sm font-normal ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ({autresCours.length} cours)
              </span>
            </h2>
            {autresCours.length === 0 ? (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Vous êtes inscrit à tous les cours disponibles.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {autresCours.map((course) => (
                  <CourseCard key={course.id} course={course} isEnrolled={false} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Catalogue