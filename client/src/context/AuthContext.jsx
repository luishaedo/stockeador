"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { getCurrentUser, login, register, logout } from "../services/authService"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = getCurrentUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  // Iniciar sesión
  const loginUser = async (credentials) => {
    try {
      setError(null)
      const userData = await login(credentials)
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión")
      throw err
    }
  }

  // Registrar usuario
  const registerUser = async (userData) => {
    try {
      setError(null)
      const newUser = await register(userData)
      setUser(newUser)
      return newUser
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario")
      throw err
    }
  }

  // Cerrar sesión
  const logoutUser = () => {
    logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext)

