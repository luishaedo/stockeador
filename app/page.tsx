import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

export default async function HomePage() {
  // Verificar si el usuario está autenticado
  const user = await getCurrentUser()

  // Si el usuario está autenticado, redirigir al dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Catálogo de Productos con Clasificación de Imágenes</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sube, clasifica y organiza tus productos con facilidad. Encuentra lo que necesitas rápidamente con nuestro
          sistema de búsqueda y filtrado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Crear Cuenta
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Iniciar Sesión
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Sube y Clasifica</h2>
            <p className="text-gray-600">
              Sube tus fotos de productos y clasifícalas con categorías y etiquetas personalizadas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Busca y Filtra</h2>
            <p className="text-gray-600">
              Encuentra rápidamente lo que necesitas con nuestro potente sistema de búsqueda y filtrado.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Gestiona tu Catálogo</h2>
            <p className="text-gray-600">Edita, actualiza y organiza tu catálogo de productos de manera eficiente.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

