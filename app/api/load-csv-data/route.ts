import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Fetch CSV data from the URL
    const csvUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DeliveryLads_Upload_selling%20price-McF45wtfE2PxJ6kWWaEfMmMzCy8qlp.csv"

    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error("Failed to fetch CSV data")
    }

    const csvText = await response.text()
    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const products = []
    const categories = new Set<string>()
    let highMarginCount = 0
    let mediumMarginCount = 0
    let lowMarginCount = 0

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

      if (values.length < headers.length) continue

      const product = {
        description: values[0] || "",
        category: values[1] || "",
        mrp: Number.parseFloat(values[2]) || 0,
        buyPrice: Number.parseFloat(values[3]) || 0,
        sellingPrice: Number.parseFloat(values[4]) || 0,
        pricingStrategy: values[5] || "",
        recommendation: values[6] || "",
      }

      // Calculate margin
      const margin = product.sellingPrice - product.buyPrice

      if (margin >= 100) {
        highMarginCount++
      } else if (margin >= 50) {
        mediumMarginCount++
      } else {
        lowMarginCount++
      }

      categories.add(product.category)
      products.push(product)
    }

    // Here you would typically save to database
    // For now, we'll return stats

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: products.length,
        categories: Array.from(categories),
        highMarginCount,
        mediumMarginCount,
        lowMarginCount,
      },
    })
  } catch (error) {
    console.error("Error loading CSV data:", error)
    return NextResponse.json({ error: "Failed to load CSV data" }, { status: 500 })
  }
}
