import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth, getCurrentUser } from "@/lib/auth"

export default async function ProfilePage() {
  // Verificar autenticación
  try {
    await requireAuth()
  } catch (error) {
    redirect("/login")
  }

  // Obtener datos del usuario
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Detalles de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-gray-500">Nombre</h3>
            <p>{user.name || "No especificado"}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">Correo Electrónico</h3>
            <p>{user.email}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">ID de Usuario</h3>
            <p className="text-sm text-gray-500">{user.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

