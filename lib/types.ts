export interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
}

export interface Product {
  id: string
  name: string
  description?: string
  category: string
  tags?: string[]
  imageUrl: string
  publicId?: string
  createdAt: string
  updatedAt?: string
  userId: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface ProductFilters {
  search?: string
  category?: string
  page?: number
  pageSize?: number
  userId?: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

