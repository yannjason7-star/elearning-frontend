import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { ArrowLeft, Upload, Trash2, PlayCircle, Pencil, X, Save } from 'lucide-react'

function AdminLecons() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { darkMode } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [moduleTitle, setModuleTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [editingModule, setEditingModule] = useState<any>(null)
  const [editTitle, setEditTitle] = useState('')

  const iconColor = darkMode ? '#ffffff' : '#111827'

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`)
      setCourse(response.data)
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [id])

  const handleUpload = async () => {
    if (!file || !moduleTitle) return
    setUploading(true)
    setUploadProgress(0)
    setMessage('')
    try {
      const formData = new FormData()
      formData.append('video', file)
      formData.append('titre', moduleTitle)
      formData.append('cours_id', id!)
      formData.append('ordre', String((course?.modules?.length || 0) + 1))

      await api.post('/courses/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          )
          setUploadProgress(percent)
        }
      })
      setMessage('Leçon ajoutée avec succès ✅')
      setFile(null)
      setModuleTitle('')
      setUploadProgress(0)
      fetchCourse()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage('Erreur: ' + err.response?.data?.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Supprimer cette leçon et sa vidéo ?')) return
    try {
      await api.delete(`/courses/modules/${moduleId}`)
      setMessage('Leçon supprimée ✅')
      fetchCourse()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage('Erreur: ' + err.response?.data?.message)
    }
  }

  const handleUpdateModule = async () => {
    if (!editingModule || !editTitle) return
    try {
      await api.put(`/courses/modules/${editingModule.id}`, { titre: editTitle })
      setMessage('Leçon modifiée ✅')
      setEditingModule(null)
      setEditTitle('')
      fetchCourse()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage('Erreur: ' + err.response?.data?.message)
    }
  }

  const modules = course?.modules
    ? [...course.modules].sort((a: any, b: any) => a.ordre - b.ordre)
    : []

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement...</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen px-10 py-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/cours')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${darkMode ? 'border-gray-700 text-gray-400 hover:text-white' : 'border-gray-300 text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft size={16} color={iconColor} />
          Retour
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {course?.titre}
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {modules.length} leçon(s) —{' '}
            <span className="text-orange-500">{course?.categorie}</span>
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      {/* Modal modification leçon */}
      {editingModule && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className={`rounded-2xl p-8 w-full max-w-md border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Modifier la leçon
              </h2>
              <button onClick={() => setEditingModule(null)}>
                <X size={20} color={iconColor} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Titre de la leçon
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateModule}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  <Save size={16} color="#ffffff" />
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditingModule(null)}
                  className={`flex-1 py-3 rounded-lg font-semibold border transition ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-600'}`}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Formulaire ajout leçon */}
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Upload size={18} color="#f97316" />
            Ajouter une leçon
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Titre de la leçon *
              </label>
              <input
                type="text"
                placeholder={`Ex: Leçon ${modules.length + 1} - Introduction`}
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`text-sm mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Vidéo de la leçon *
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              />
            </div>

            {uploading && (
              <div className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Upload en cours...
                  </span>
                  <span className="text-orange-500 font-semibold">
                    {uploadProgress}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div
                    className="h-2 bg-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || !moduleTitle || uploading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <Upload size={16} color="#ffffff" />
              {uploading ? `Upload... ${uploadProgress}%` : 'Ajouter la leçon'}
            </button>
          </div>
        </div>

        {/* Liste des leçons */}
        <div className={`card rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Leçons du cours ({modules.length})
          </h2>
          {modules.length === 0 ? (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Aucune leçon ajoutée pour le moment.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {modules.map((module: any, index: number) => (
                <div
                  key={module.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                      <PlayCircle size={16} color="#ffffff" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {module.titre}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Leçon {index + 1}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-2">
                    <button
                      onClick={() => {
                        setEditingModule(module)
                        setEditTitle(module.titre)
                      }}
                      className={`p-1.5 rounded-lg border transition ${darkMode ? 'border-gray-700 text-gray-400 hover:text-white hover:border-orange-500' : 'border-gray-300 text-gray-500 hover:border-orange-500'}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-1.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminLecons