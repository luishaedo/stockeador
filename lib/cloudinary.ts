import { v2 as cloudinary } from "cloudinary"

// Configurar Cloudinary con las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Función para subir una imagen a Cloudinary
export async function uploadImage(file: Buffer, folder = "product-catalog"): Promise<string> {
  try {
    // Convertir el buffer a base64
    const base64Data = `data:image/jpeg;base64,${file.toString("base64")}`

    // Subir la imagen a Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Data,
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
    })

    return result.secure_url
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error)
    throw new Error("Error al subir la imagen")
  }
}

// Función para eliminar una imagen de Cloudinary
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error)
        else resolve()
      })
    })
  } catch (error) {
    console.error("Error al eliminar imagen de Cloudinary:", error)
  }
}

// Extraer el public_id de una URL de Cloudinary
export function getPublicIdFromUrl(url: string): string | null {
  try {
    // Las URLs de Cloudinary tienen este formato: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    const regex = /\/v\d+\/(.+)\.\w+$/
    const match = url.match(regex)
    return match ? match[1] : null
  } catch (error) {
    return null
  }
}

