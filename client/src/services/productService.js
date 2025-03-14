import api from "./api"

// Obtener productos con paginación y filtros
export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params })
  return response.data
}

// Obtener un producto por ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

// Crear un nuevo producto
export const createProduct = async (productData) => {
  const formData = new FormData()

  // Agregar campos al FormData
  Object.keys(productData).forEach((key) => {
    if (key === "image") {
      formData.append(key, productData[key])
    } else {
      formData.append(key, productData[key])
    }
  })

  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

// Actualizar un producto
export const updateProduct = async (id, productData) => {
  const formData = new FormData()

  // Agregar campos al FormData
  Object.keys(productData).forEach((key) => {
    if (key === "image" && productData[key]) {
      formData.append(key, productData[key])
    } else if (key !== "image") {
      formData.append(key, productData[key])
    }
  })

  const response = await api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

// Eliminar un producto
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

// Obtener todas las categorías
export const getCategories = async () => {
  const response = await api.get("/products/categories")
  return response.data
}

