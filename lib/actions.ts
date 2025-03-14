"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "./prisma"
import { uploadImage, deleteImage, getPublicIdFromUrl } from "./cloudinary"
import type { PaginatedResponse, ProductFilters } from "./types"
import { registerUser, loginUser, logoutUser, getCurrentUser, requireAuth } from "./auth"

// Función para obtener productos con paginación y filtros
export async function getProducts(filters?: ProductFilters): Promise<PaginatedResponse<any>> {
  // Asegurarse de que el usuario está autenticado para rutas protegidas
  const user = await getCurrentUser()
  const userId = filters?.userId || user?.id

  if (!userId) {
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    }
  }

  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 12
  const skip = (page - 1) * pageSize

  // Construir la consulta
  const where: any = { userId }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { tags: { hasSome: [filters.search] } },
    ]
  }

  if (filters?.category) {
    where.category = filters.category
  }

  // Obtener el total de productos
  const total = await prisma.product.count({ where })

  // Obtener los productos paginados
  const products = await prisma.product.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  })

  // Calcular el total de páginas
  const totalPages = Math.ceil(total / pageSize)

  return {
    data: products,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
    },
  }
}

// Función para agregar un nuevo producto
export async function addProduct(formData: FormData) {
  // Verificar autenticación
  const session = await requireAuth()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const tagsString = formData.get("tags") as string
  const image = formData.get("image") as File

  if (!name || !category || !image) {
    throw new Error("Faltan campos requeridos")
  }

  // Procesar etiquetas
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : []

  // Subir imagen a Cloudinary
  const buffer = Buffer.from(await image.arrayBuffer())
  const imageUrl = await uploadImage(buffer)

  // Crear producto en la base de datos
  const product = await prisma.product.create({
    data: {
      name,
      description,
      category,
      tags,
      imageUrl,
      publicId: getPublicIdFromUrl(imageUrl),
      userId: session.userId,
    },
  })

  // Asegurarse de que la categoría existe
  await prisma.category.upsert({
    where: { name: category },
    update: {},
    create: { name: category },
  })

  revalidatePath("/dashboard")
  return product
}

// Función para actualizar un producto existente
export async function updateProduct(formData: FormData) {
  // Verificar autenticación
  const session = await requireAuth()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const tagsString = formData.get("tags") as string
  const image = formData.get("image") as File | null

  if (!id || !name || !category) {
    throw new Error("Faltan campos requeridos")
  }

  // Procesar etiquetas
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : []

  // Obtener el producto existente
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  })

  if (!existingProduct) {
    throw new Error("Producto no encontrado")
  }

  // Verificar que el producto pertenece al usuario actual
  if (existingProduct.userId !== session.userId) {
    throw new Error("No tienes permiso para editar este producto")
  }

  let imageUrl = existingProduct.imageUrl
  let publicId = existingProduct.publicId

  // Si se subió una nueva imagen, reemplazar la anterior
  if (image && image.size > 0) {
    // Eliminar imagen anterior si existe
    if (existingProduct.publicId) {
      await deleteImage(existingProduct.publicId)
    }

    // Subir nueva imagen
    const buffer = Buffer.from(await image.arrayBuffer())
    imageUrl = await uploadImage(buffer)
    publicId = getPublicIdFromUrl(imageUrl)
  }

  // Actualizar producto
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      category,
      tags,
      imageUrl,
      publicId,
    },
  })

  // Asegurarse de que la categoría existe
  await prisma.category.upsert({
    where: { name: category },
    update: {},
    create: { name: category },
  })

  revalidatePath("/dashboard")
  return updatedProduct
}

// Función para eliminar un producto
export async function deleteProduct(id: string) {
  // Verificar autenticación
  const session = await requireAuth()

  // Obtener el producto
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) {
    throw new Error("Producto no encontrado")
  }

  // Verificar que el producto pertenece al usuario actual
  if (product.userId !== session.userId) {
    throw new Error("No tienes permiso para eliminar este producto")
  }

  // Eliminar imagen de Cloudinary si existe
  if (product.publicId) {
    await deleteImage(product.publicId)
  }

  // Eliminar producto de la base de datos
  await prisma.product.delete({
    where: { id },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

// Función para obtener todas las categorías
export async function getCategories(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return categories.map((category) => category.name)
}

// Función para registrar un nuevo usuario
export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!name || !email || !password || !confirmPassword) {
    return { success: false, message: "Todos los campos son requeridos" }
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Las contraseñas no coinciden" }
  }

  const result = await registerUser(email, password, name)

  if (result.success) {
    // Iniciar sesión automáticamente después del registro
    await loginUser(email, password)
    redirect("/dashboard")
  }

  return result
}

// Función para iniciar sesión
export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, message: "Correo electrónico y contraseña son requeridos" }
  }

  const result = await loginUser(email, password)

  if (result.success) {
    redirect("/dashboard")
  }

  return result
}

// Función para cerrar sesión
export async function logout() {
  await logoutUser()
  redirect("/login")
}

