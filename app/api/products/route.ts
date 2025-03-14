import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/actions"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "12")
    const search = searchParams.get("search") || undefined
    const category = searchParams.get("category") || undefined

    const products = await getProducts({
      page,
      pageSize,
      search,
      category,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Error al obtener los productos" }, { status: 500 })
  }
}

