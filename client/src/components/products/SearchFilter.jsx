"use client"

import { useState } from "react"

const SearchFilter = ({ searchTerm, categoryFilter, categories, onSearch, onCategoryFilter }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(localSearchTerm)
  }

  const handleReset = () => {
    setLocalSearchTerm("")
    onSearch("")
    onCategoryFilter("")
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Buscar
        </button>

        {(searchTerm || categoryFilter) && (
          <button
            type="button"
            onClick={handleReset}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Limpiar
          </button>
        )}
      </form>
    </div>
  )
}

export default SearchFilter

