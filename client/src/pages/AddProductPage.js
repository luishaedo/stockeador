"use client"
import ProductForm from "../components/products/ProductForm"
import { createProduct } from "../services/productService"

const AddProductPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Agregar Nuevo Producto</h1>
      <ProductForm onSubmit={createProduct} />
    </div>
  )
}

export default AddProductPage

