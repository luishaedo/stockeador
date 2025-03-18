"use client"
import { Link } from "react-router-dom"

const ProductCard = ({ product, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative h-48 bg-gray-100">
        <img src={product.imageUrl || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-contain" />
        <div className="absolute top-2 right-2 flex gap-1">
          <Link
            to={`/dashboard/edit/${product.id}`}
            className="bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span className="sr-only">Editar</span>
          </Link>
          <button
            onClick={onDelete}
            className="bg-red-600 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Eliminar</span>
          </button>
        </div>
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
          {product.category}
        </span>
        <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
      </div>
      <div className="p-4 pt-0 flex flex-wrap gap-1">
        {product.tags &&
          product.tags.map((tag) => (
            <span key={tag} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
      </div>
    </div>
  )
}

export default ProductCard

