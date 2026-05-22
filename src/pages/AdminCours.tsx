import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Plus, BookOpen, Users, Pencil, Trash2, X, Save, Image } from 'lucide-react'

function AdminCours() {
  const { darkMode } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: ''
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)

  const iconColor = darkMode ? '#ffffff' : '#111827'

  const fetchData = async () => {
    try {
      const [coursesRes, statsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/courses/admin/stats')
      ])
      setCourses(coursesRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleCreateCourse = async () => {
    if (!formData.titre || !formData.categorie) return
    try {
      const res = await api.post('/courses', formData)
      const newCourseId = res.data.id

      // Upload image de couverture si fournie
      if (coverFile) {
        setUploadingCover(true)
        const imageData = new FormData()
        imageData.append('image', coverFile)
        await api.post(`/courses/cover/${newCourseId}`, imageData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setUploadingCover(false)
      }

      setMessage('Cours créé avec succès ✅')
      setFormData({ titre: '', description: '', categorie: '' })
      setCoverFile(null)
      setCoverPreview(null)
      setShowForm(false)
      fetchData()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage('Erreur: ' + err.response?.data?.message)
      setUploadingCover(false)
    }
  }

  const handleUpdateCourse = async () => {
    if (!editingCourse || !formData.titre || !formData.categorie) return
    try {
      await api.put(`/courses/${editingCourse.id}`, formData)

      // Upload nouvelle image si fournie
      if (coverFile) {
        setUploadingCover(true)
        const imageData = new FormData()
        imageData.append('image', coverFile)
        await api.post(`/courses/cover/${editingCourse.id}`, imageData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setUploadingCover(false)
      }

      setMessage('Cours modifié avec succès ✅')
      setEditingCourse(null)
      setFormData({ titre: '', description: '', categorie: '' })
      setCoverFile(null)
      setCoverPreview(null)
      fetchData()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage('Erreur: ' + err.response?.data?.message)
      setUploadingCover(false)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Supprimer ce cours et toutes ses leçons ?')) return
    try {
      await api.delete(`/courses/${id}`)
      fetchData()
      setMessage('Cours supprimé ✅')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage('Erreur suppression: ' + err.response?.data?.message)
    }
  }

  const openEditModal = (course: any) => {
    setEditingCourse(course)
    setFormData({
      titre: course.titre,
      description: course.description || '',
      categorie: course.categorie
    })
    setCoverPreview(course.image_url || null)
    setCoverFile(null)
  }

  const closeModal = () => {
    setShowForm(false)
    setEditingCourse(null)
    setFormData({ titre: '', description: '', categorie: '' })
    setCoverFile(null)
    setCoverPreview(null)
  }

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Gestion des <span className="text-orange-500">cours</span>
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {courses.length} cours disponibles
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition"
        >
          <Plus size={18} color="#ffffff" />
          Nouveau cours
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      {/* Modal création / modification */}
      {(showForm || editingCourse) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4 overflow-y-auto">
          <div className={`rounded-2xl p-8 w-full max-w-lg border my-8 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingCourse ? 'Modifier le cours' : 'Créer un nouveau cours'}
              </h2>
              <button onClick={closeModal}>
                <X size={20} color={iconColor} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Titre du cours *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Formation React JS"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Catégorie *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Développement Web"
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Description
                </label>
                <textarea
                  placeholder="Décrivez le contenu du cours..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                />
              </div>

              {/* Image de couverture */}
              <div>
                <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Image de couverture
                </label>
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Aperçu"
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <label className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition ${darkMode ? 'border-gray-700 text-gray-400 hover:border-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-500'}`}>
                  <Image size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                  <span className="text-sm">
                    {coverFile ? coverFile.name : 'Choisir une image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
                  disabled={uploadingCover}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
                >
                  <Save size={16} color="#ffffff" />
                  {uploadingCover ? 'Upload image...' : editingCourse ? 'Enregistrer' : 'Créer le cours'}
                </button>
                <button
                  onClick={closeModal}
                  className={`flex-1 py-3 rounded-lg font-semibold transition border ${darkMode ? 'border-gray-700 text-gray-400 hover:text-white' : 'border-gray-300 text-gray-600'}`}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des cours */}
      {loading ? (
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
      ) : courses.length === 0 ? (
        <div className={`rounded-2xl p-12 border text-center ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <BookOpen size={48} color="#f97316" className="mx-auto mb-4" />
          <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Aucun cours créé
          </p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Cliquez sur "Nouveau cours" pour commencer
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`card rounded-2xl overflow-hidden border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              {/* Image de couverture ou bande orange */}
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
                <p className={`text-sm line-clamp-2 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {course.description}
                </p>
                <div className={`flex items-center gap-2 text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Users size={14} color={iconColor} />
                  <span>{stats[course.id] || 0} apprenant(s)</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/admin/cours/${course.id}`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium transition"
                  >
                    <Pencil size={14} color="#ffffff" />
                    Gérer
                  </button>
                  <button
                    onClick={() => openEditModal(course)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition ${darkMode ? 'border-gray-700 text-gray-400 hover:text-white hover:border-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-500'}`}
                  >
                    <Pencil size={14} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminCours