"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Filter, Edit, Trash } from "lucide-react"
import { getProducts, getCategories, deleteProduct } from "@/lib/actions"
import type { Product } from "@/lib/types"
import EditProductModal from "./edit-product-modal"
import { useToast } from "@/hooks/use-toast"

export default function ProductGallery() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [pageSize, setPageSize] = useState(8)

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Load initial data and handle URL params
  useEffect(() => {
    const page = Number.parseInt(searchParams.get("page") || "1")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""

    setCurrentPage(page)
    setSearchTerm(search)
    setCategoryFilter(category)

    loadProducts(page, search, category)
    loadCategories()
  }, [searchParams])

  // Load products with filters and pagination
  const loadProducts = async (page = currentPage, search = searchTerm, category = categoryFilter) => {
    setLoading(true)
    try {
      const response = await getProducts({
        page,
        pageSize,
        search,
        category: category || undefined,
      })

      setProducts(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalProducts(response.pagination.total)
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load categories for filter
  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  // Handle search and filter changes
  const handleSearch = () => {
    updateUrlAndLoadProducts(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    updateUrlAndLoadProducts(1, value)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setCategoryFilter("")
    updateUrlAndLoadProducts(1, "", "")
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateUrlAndLoadProducts(page)
  }

  // Update URL with search params and load products
  const updateUrlAndLoadProducts = (page: number, category = categoryFilter, search = searchTerm) => {
    const params = new URLSearchParams()

    if (page > 1) params.set("page", page.toString())
    if (search) params.set("search", search)
    if (category) params.set("category", category)

    const queryString = params.toString()
    const url = queryString ? `?${queryString}` : ""

    router.push(url)
    loadProducts(page, search, category)
  }

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  // Handle delete product
  const handleDeleteProduct = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(id)
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido eliminado correctamente",
        })
        loadProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto",
          variant: "destructive",
        })
      }
    }
  }

  // Handle edit success
  const handleEditSuccess = () => {
    toast({
      title: "Producto actualizado",
      description: "El producto ha sido actualizado correctamente",
    })
    loadProducts()
  }

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1

            // Show first page, last page, and pages around current page
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            }

            // Show ellipsis for skipped pages
            if (page === 2 || page === totalPages - 1) {
              return (
                <PaginationItem key={`ellipsis-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return null
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Todas las categorías" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch}>Buscar</Button>

        {(searchTerm || categoryFilter) && (
          <Button variant="outline" onClick={resetFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>

      {totalProducts > 0 && (
        <p className="text-sm text-gray-500">
          Mostrando {products.length} de {totalProducts} productos
        </p>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta con otros términos de búsqueda o categorías</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gray-100">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full opacity-90"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full opacity-90"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </div>
              <CardContent className="flex-1 p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                <Badge className="mb-2">{product.category}</Badge>
                <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
                {product.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {renderPagination()}

      <EditProductModal
        product={selectedProduct}
        categories={categories}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}

