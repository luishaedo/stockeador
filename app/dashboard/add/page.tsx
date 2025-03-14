import { redirect } from "next/navigation"
import UploadForm from "@/components/upload-form"
import { requireAuth } from "@/lib/auth"
import { getCategories } from "@/lib/actions"

export default async function AddProductPage() {
  // Verificar autenticación
  try {
    await requireAuth()
  } catch (error) {
    redirect("/login")
  }

  // Obtener categorías para el formulario
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Agregar Nuevo Producto</h1>
      <UploadForm categories={categories} />
    </div>
  )
}

