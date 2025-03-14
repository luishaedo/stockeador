import { Suspense } from "react"
import { redirect } from "next/navigation"
import ProductGallery from "@/components/product-gallery"
import { requireAuth } from "@/lib/auth"

export default async function DashboardPage() {
  // Verificar autenticación
  try {
    await requireAuth()
  } catch (error) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Mi Catálogo de Productos</h1>

      <Suspense fallback={<div className="text-center">Cargando productos...</div>}>
        <ProductGallery />
      </Suspense>
    </div>
  )
}

