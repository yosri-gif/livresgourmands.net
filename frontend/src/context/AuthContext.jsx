import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('lg_token') || null)
  const [user,  setUser]  = useState(() => {
    const saved = localStorage.getItem('lg_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // Injecter le token dans tous les headers Axios
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('lg_token', data.token)
      localStorage.setItem('lg_user', JSON.stringify(data.user))
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur de connexion.'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  const register = async (nom, email, password) => {
    setLoading(true); setError(null)
    try {
      await api.post('/auth/register', { nom, email, password })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'inscription.'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null); setUser(null)
    localStorage.removeItem('lg_token')
    localStorage.removeItem('lg_user')
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
