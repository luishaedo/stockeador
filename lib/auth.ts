import { compare, hash } from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "./prisma"

// Función para hashear contraseñas
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

// Función para verificar contraseñas
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

// Función para registrar un nuevo usuario
export async function registerUser(email: string, password: string, name: string) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, message: "El correo electrónico ya está registrado" }
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password)

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return { success: false, message: "Error al registrar usuario" }
  }
}

// Función para iniciar sesión
export async function loginUser(email: string, password: string) {
  try {
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, message: "Usuario no encontrado" }
    }

    // Verificar la contraseña
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return { success: false, message: "Contraseña incorrecta" }
    }

    // Crear una sesión
    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    }

    // Guardar la sesión en una cookie
    cookies().set("session", JSON.stringify(session), {
      expires: session.expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })

    return { success: true, user: { id: user.id, email: user.email, name: user.name } }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return { success: false, message: "Error al iniciar sesión" }
  }
}

// Función para cerrar sesión
export async function logoutUser() {
  cookies().delete("session")
}

// Función para obtener la sesión actual
export async function getSession() {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)

    // Verificar si la sesión ha expirado
    if (new Date(session.expires) < new Date()) {
      cookies().delete("session")
      return null
    }

    return session
  } catch (error) {
    return null
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    })

    return user
  } catch (error) {
    return null
  }
}

// Middleware para proteger rutas
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function logout() {
  await logoutUser()
  redirect("/login")
}

