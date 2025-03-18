"use client"

import { useState, useEffect } from "react"
import { getProfile } from "../services/authService"
import { useAuth } from "../context/AuthContext"

const ProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile()
        setProfile(data)
      } catch (error) {
        console.error("Error al cargar perfil:", error)
        setError("No se pudo cargar la información del perfil")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold">
              {profile?.name?.charAt(0) || profile?.email?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile?.name || "Usuario"}</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">ID de Usuario</h3>
              <p className="mt-1">{profile?.id}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Fecha de Registro</h3>
              <p className="mt-1">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "No disponible"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage

