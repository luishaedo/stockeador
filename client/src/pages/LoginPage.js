"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoginForm from "../components/auth/LoginForm"
import { useAuth } from "../context/AuthContext"

const LoginPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Iniciar Sesión</h1>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage

