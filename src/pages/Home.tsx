import { Link } from 'react-router-dom'
import { Video, BarChart2, Globe, CheckCircle } from 'lucide-react'
import heroImage from '../assets/hero.png'

function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-900">
        <h1 className="text-2xl font-bold text-orange-500">ELearnPro</h1>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2 rounded-full font-semibold transition text-sm"
          >
            Se connecter
          </Link>
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold transition text-sm"
          >
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 pt-20 pb-16">
        <span className="bg-orange-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          🎓 Plateforme de formation en ligne
        </span>
        <h1 className="text-6xl font-bold leading-tight mb-6 max-w-3xl">
          Apprenez à votre rythme avec{' '}
          <span className="text-orange-500">ELearnPro</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mb-10 leading-relaxed">
          Accédez à des formations de qualité, suivez votre progression et développez vos compétences depuis n'importe où dans le monde.
        </p>
        <div className="flex gap-4 mb-16">
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-3.5 rounded-full font-bold transition"
          >
            Commencer gratuitement →
          </Link>
          <Link
            to="/login"
            className="border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-orange-500 text-lg px-8 py-3.5 rounded-full font-bold transition"
          >
            Se connecter
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-12 mb-16">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">100%</p>
            <p className="text-gray-500 text-sm mt-1">En ligne</p>
          </div>
          <div className="w-px bg-gray-800"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">∞</p>
            <p className="text-gray-500 text-sm mt-1">Formations</p>
          </div>
          <div className="w-px bg-gray-800"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">24/7</p>
            <p className="text-gray-500 text-sm mt-1">Accessible</p>
          </div>
        </div>

        {/* Mockup interface */}
        <div className="w-full max-w-4xl mx-auto mb-20 relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-orange-500 opacity-10 blur-3xl rounded-3xl"></div>

          {/* Laptop frame */}
          <div className="relative bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1 bg-gray-800 rounded-full px-4 py-1 ml-4 text-xs text-gray-500 text-left">
                elearnpro.vercel.app
              </div>
            </div>

            {/* Interface preview */}
            <div className="flex h-72">
              {/* Sidebar simulée */}
              <div className="w-44 bg-gray-900 border-r border-gray-700 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-lg"></div>
                  <span className="text-orange-500 font-bold text-sm">ELearnPro</span>
                </div>
                {['Accueil', 'Cours', 'Progression', "Temps d'étude", 'Mon profil'].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${i === 1 ? 'bg-orange-500 text-white' : 'text-gray-500'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-white' : 'bg-gray-600'}`}></div>
                    {item}
                  </div>
                ))}
              </div>

              {/* Contenu simulé — page Cours */}
              <div className="flex-1 p-5 bg-gray-950 overflow-hidden">
                <p className="text-white font-bold text-sm mb-1">Mes <span className="text-orange-500">formations</span></p>
                <p className="text-gray-500 text-xs mb-4">Gérez vos inscriptions et découvrez de nouvelles formations</p>

                {/* Section Mes cours */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white text-xs font-bold">Mes cours</span>
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { titre: 'Formation en JavaScript', cat: 'DÉVELOPPEMENT WEB', color: 'from-blue-900 to-cyan-900' },
                      { titre: 'Formation Chariow et Facebook Ads', cat: 'BUSINESS', color: 'from-purple-900 to-pink-900' }
                    ].map((cours, i) => (
                      <div key={i} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                        {/* Image de couverture */}
                        <img src={heroImage} alt={cours.titre} className="w-full h-24 object-cover" />
                        <div className="p-2">
                          <p className="text-white font-semibold" style={{ fontSize: '9px' }}>{cours.titre}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-green-500" style={{ fontSize: '8px' }}>Inscrit</span>
                          </div>
                          <div className="w-full h-1 bg-gray-700 rounded-full mt-1.5">
                            <div className="h-1 bg-orange-500 rounded-full" style={{ width: ['40%', '75%'][i] }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop base */}
          <div className="h-4 bg-gray-800 rounded-b-xl mx-8 border border-t-0 border-gray-700"></div>
          <div className="h-2 bg-gray-700 rounded-b-xl mx-4"></div>
        </div>
      </div>

      {/* Features */}
      <div className="px-10 pb-20">
        <p className="text-center text-gray-500 text-sm uppercase tracking-widest mb-10">
          Tout ce dont vous avez besoin
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500 transition">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Video size={22} color="#ffffff" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Vidéos HD</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Des cours en vidéo haute qualité, accessibles depuis n'importe quel appareil.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500 transition">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
              <BarChart2 size={22} color="#ffffff" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Suivi de progression</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Visualisez votre avancement avec des graphiques détaillés par cours et par jour.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500 transition">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Globe size={22} color="#ffffff" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Accessible partout</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Apprenez depuis n'importe où dans le monde, à votre propre rythme.
            </p>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="px-10 pb-20">
        <div className="bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-30 rounded-3xl p-12 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre formation ?
          </h2>
          <p className="text-gray-400 mb-8">
            Rejoignez ELearnPro et accédez à toutes nos formations dès aujourd'hui.
          </p>
          <div className="flex gap-6 justify-center flex-wrap mb-8">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <CheckCircle size={16} color="#22c55e" />
              Gratuit
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <CheckCircle size={16} color="#22c55e" />
              Sans engagement
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <CheckCircle size={16} color="#22c55e" />
              Accessible partout
            </div>
          </div>
          <Link
            to="/register"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-lg px-10 py-3.5 rounded-full font-bold transition"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Home