"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ImageIcon } from "lucide-react"
import type { Product } from "@/lib/types"
import { updateProduct } from "@/lib/actions"

interface EditProductModalProps {
  product: Product | null
  categories: string[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditProductModal({ product, categories, isOpen, onClose, onSuccess }: EditProductModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description || "")
      setCategory(product.category)
      setTags(product.tags ? product.tags.join(", ") : "")
      setImagePreview(product.imageUrl)
      setImageFile(null)
    }
  }, [product])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || !name || !category) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("id", product.id)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("tags", tags)

      if (imageFile) {
        formData.append("image", imageFile)
      }

      await updateProduct(formData)
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar el producto:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>Actualiza los detalles y la clasificación del producto.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre del Producto</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Categoría</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="edit-category">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Etiquetas (separadas por comas)</Label>
            <Input
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ej: nuevo, oferta, premium"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagen del Producto</Label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative w-full h-48 border rounded-md overflow-hidden">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Vista previa"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md border-gray-300 p-4">
                  <ImageIcon className="h-16 w-16 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Sin imagen</p>
                </div>
              )}
              <div className="flex gap-2 w-full">
                <Input id="edit-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("edit-image")?.click()}
                >
                  {imageFile ? "Cambiar imagen" : "Seleccionar nueva imagen"}
                </Button>
                {imageFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(product?.imageUrl || null)
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !name || !category}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Guardando...
              </span>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

