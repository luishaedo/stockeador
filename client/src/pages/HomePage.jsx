import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Catálogo de Productos con Clasificación de Imágenes</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sube, clasifica y organiza tus productos con facilidad. Encuentra lo que necesitas rápidamente con nuestro
          sistema de búsqueda y filtrado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-medium"
            >
              Ir al Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-medium"
              >
                Crear Cuenta
              </Link>
              <Link
                to="/login"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 text-lg font-medium"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
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

export default HomePage

