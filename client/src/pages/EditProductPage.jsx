"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ProductForm from "../components/products/ProductForm"
import { getProductById, updateProduct } from "../services/productService"

const EditProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch (error) {
        console.error("Error al cargar producto:", error)
        setError("No se pudo cargar el producto")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleSubmit = async (productData) => {
    return await updateProduct(id, productData)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Volver al Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Editar Producto</h1>
      {product && <ProductForm initialData={product} onSubmit={handleSubmit} isEditing={true} />}
    </div>
  )
}

export default EditProductPage

