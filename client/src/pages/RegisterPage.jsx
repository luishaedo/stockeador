"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RegisterForm from "../components/auth/RegisterForm"
import { useAuth } from "../context/AuthContext"

const RegisterPage = () => {
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
        <h1 className="text-3xl font-bold text-center mb-8">Crear Cuenta</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage

