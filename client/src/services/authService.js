import api from "./api"

// Registrar usuario
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData)
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data))
  }
  return response.data
}

// Iniciar sesión
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials)
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data))
  }
  return response.data
}

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// Obtener usuario actual
export const getCurrentUser = () => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

// Obtener perfil de usuario
export const getProfile = async () => {
  const response = await api.get("/auth/profile")
  return response.data
}

