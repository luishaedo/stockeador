"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getProducts, deleteProduct, getCategories } from "../../services/productService"
import ProductCard from "./ProductCard"
import Pagination from "../common/Pagination"
import SearchFilter from "./SearchFilter"

const ProductGallery = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Estado para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [pageSize] = useState(8)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  // Cargar productos y categorías
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [currentPage, searchTerm, categoryFilter])

  // Cargar productos con filtros y paginación
  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts({
        page: currentPage,
        pageSize,
        search: searchTerm,
        category: categoryFilter,
      })

      setProducts(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalProducts(response.pagination.total)
    } catch (error) {
      console.error("Error al cargar productos:", error)
      setError("No se pudieron cargar los productos")
    } finally {
      setLoading(false)
    }
  }

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    }
  }

  // Manejar cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Manejar búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  // Manejar filtro de categoría
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category)
    setCurrentPage(1)
  }

  // Manejar eliminación de producto
  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(id)
        // Recargar productos
        loadProducts()
      } catch (error) {
        console.error("Error al eliminar producto:", error)
        setError("No se pudo eliminar el producto")
      }
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mis Productos</h2>
        <Link to="/dashboard/add" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Agregar Producto
        </Link>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        categories={categories}
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
      />

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {totalProducts > 0 && (
        <p className="text-sm text-gray-500">
          Mostrando {products.length} de {totalProducts} productos
        </p>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No se encontraron productos</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || categoryFilter
              ? "Intenta con otros términos de búsqueda o categorías"
              : "Comienza agregando tu primer producto"}
          </p>
          {!searchTerm && !categoryFilter && (
            <Link to="/dashboard/add" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Agregar Producto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={() => handleDeleteProduct(product.id)} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}

export default ProductGallery

