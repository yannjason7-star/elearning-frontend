function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400 py-10 px-10">
      
      <div className="flex justify-between items-start mb-8">
        
        {/* Logo et description */}
        <div className="max-w-xs">
          <h2 className="text-orange-500 font-bold text-xl mb-3">ELearnPro</h2>
          <p className="text-sm">
            La plateforme de formation en ligne pour apprendre à votre rythme, où que vous soyez dans le monde.
          </p>
        </div>

        {/* Liens */}
        <div>
          <h3 className="text-white font-semibold mb-3">Navigation</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="hover:text-white cursor-pointer">Accueil</li>
            <li className="hover:text-white cursor-pointer">Catalogue</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>joelsimotasse@gmail.com</li>
            <li>+237 6 55 00 48 22</li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 pt-5 text-center text-sm">
        © 2025 ELearnPro. Tous droits réservés.
      </div>

    </footer>
  )
}

export default Footer