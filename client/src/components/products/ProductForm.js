"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCategories } from "../../services/productService"

const ProductForm = ({ initialData = {}, onSubmit, isEditing = false }) => {
  const [name, setName] = useState(initialData.name || "")
  const [description, setDescription] = useState(initialData.description || "")
  const [category, setCategory] = useState(initialData.category || "")
  const [tags, setTags] = useState(initialData.tags ? initialData.tags.join(", ") : "")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || "")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Error al cargar categorías:", error)
      }
    }

    loadCategories()
  }, [])

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !category || (!image && !isEditing)) {
      setError("Nombre, categoría e imagen son campos requeridos")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Preparar datos del producto
      const productData = {
        name,
        description,
        category,
        tags,
        ...(image && { image }),
      }

      // Enviar datos
      await onSubmit(productData)

      // Redirigir al dashboard
      navigate("/dashboard")
    } catch (error) {
      console.error("Error al guardar producto:", error)
      setError(error.response?.data?.message || "Error al guardar el producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">{isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
            Nombre del Producto *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
            Categoría *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.length > 0
              ? categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))
              : ["Electrónicos", "Ropa", "Hogar", "Juguetes", "Deportes", "Alimentos", "Otros"].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-gray-700 font-medium mb-1">
            Etiquetas (separadas por comas)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ej: nuevo, oferta, premium"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Imagen del Producto {!isEditing && "*"}</label>
          <div className="flex flex-col items-center gap-4">
            {imagePreview ? (
              <div className="relative w-full h-64 border rounded-md overflow-hidden">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Vista previa"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-md border-gray-300 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400 mb-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-500">Haz clic para seleccionar una imagen</p>
              </div>
            )}
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={imagePreview ? "hidden" : ""}
              required={!isEditing && !imagePreview}
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImage(null)
                  setImagePreview(isEditing ? initialData.imageUrl : "")
                }}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                {isEditing ? "Restaurar imagen original" : "Eliminar imagen"}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditing ? "Guardando..." : "Creando..."}
              </span>
            ) : isEditing ? (
              "Guardar Cambios"
            ) : (
              "Crear Producto"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

