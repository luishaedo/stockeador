import ProductGallery from "../components/products/ProductGallery"

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Catálogo de Productos</h1>
      <ProductGallery />
    </div>
  )
}

export default DashboardPage

