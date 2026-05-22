import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const storedTheme = localStorage.getItem('darkMode')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    if (storedTheme === 'false') {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    setLoading(false)
  }, [])

  const toggleTheme = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const login = (token: string, user: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-950"></div>
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, darkMode, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}