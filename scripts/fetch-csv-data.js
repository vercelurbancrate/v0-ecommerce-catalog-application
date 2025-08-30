async function fetchCsvData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DeliveryLads_Upload_selling%20price-McF45wtfE2PxJ6kWWaEfMmMzCy8qlp.csv",
    )
    const csvText = await response.text()

    console.log("CSV Data fetched successfully")
    console.log("First 500 characters:", csvText.substring(0, 500))

    // Parse CSV manually
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("Headers:", headers)

    const products = []
    const categories = new Set()

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Split by comma but handle quoted values
      const values = []
      let current = ""
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())

      // Skip if not enough values
      if (values.length < 6) continue

      // Extract product data based on new schema
      const productDescription = values[0]?.replace(/"/g, "") || ""
      const category = values[1]?.replace(/"/g, "") || ""
      const mrp = Number.parseFloat(values[2]) || 0
      const buyPrice = Number.parseFloat(values[3]) || 0
      const sellingPrice = Number.parseFloat(values[4]) || 0
      const pricingStrategy = values[5]?.replace(/"/g, "") || ""
      const recommendation = values[6]?.replace(/"/g, "") || ""

      if (productDescription && category && sellingPrice > 0) {
        // Calculate profit margin
        const profitMarginRupees = sellingPrice - buyPrice
        const profitMarginPercentage = buyPrice > 0 ? (profitMarginRupees / buyPrice) * 100 : 0

        // Implement margin-based pricing strategy
        let finalSellingPrice = sellingPrice
        let marginCategory = "small"

        if (profitMarginRupees >= 100) {
          marginCategory = "high"
        } else if (profitMarginRupees >= 50) {
          marginCategory = "medium"
        } else {
          // Small margin: sell at buy price (no profit)
          finalSellingPrice = buyPrice
          marginCategory = "small"
        }

        // Extract brand from product description (first word usually)
        const words = productDescription.split(" ")
        const brand = words[0] || "Generic"

        // Extract quantity from description
        const quantityMatch = productDescription.match(/(\d+(?:\.\d+)?(?:g|kg|ml|l|pcs?|pieces?|units?))/i)
        const quantity = quantityMatch ? quantityMatch[1] : "1 unit"

        categories.add(category)

        // Generate image URL based on product name
        const imageUrl = await generateProductImageUrl(productDescription, brand)

        products.push({
          id: `${products.length + 1}`,
          name: productDescription,
          brand: brand,
          category: category,
          buyPrice: Math.round(buyPrice),
          mrp: Math.round(mrp),
          sellingPrice: Math.round(finalSellingPrice),
          originalSellingPrice: Math.round(sellingPrice),
          profitMarginRupees: Math.round((finalSellingPrice - buyPrice) * 100) / 100,
          profitMarginPercentage: Math.round(((finalSellingPrice - buyPrice) / buyPrice) * 100 * 100) / 100,
          pricingStrategy: pricingStrategy,
          recommendation: recommendation,
          quantity: quantity,
          marginCategory: marginCategory,
          isHighMargin: profitMarginRupees >= 100,
          isMediumMargin: profitMarginRupees >= 50 && profitMarginRupees < 100,
          imageUrl: imageUrl,
        })
      }
    }

    console.log(`Parsed ${products.length} products`)
    console.log("Categories found:", Array.from(categories))
    console.log("High margin products:", products.filter((p) => p.isHighMargin).length)
    console.log("Medium margin products:", products.filter((p) => p.isMediumMargin).length)
    console.log("Small margin products:", products.filter((p) => !p.isHighMargin && !p.isMediumMargin).length)

    return {
      products,
      categories: Array.from(categories).sort(),
    }
  } catch (error) {
    console.error("Error fetching CSV:", error)
    return { products: [], categories: [] }
  }
}

async function generateProductImageUrl(productName, brand) {
  // Try to fetch real product images from common e-commerce sites
  const searchTerms = `${brand} ${productName}`.replace(/[^\w\s]/g, "").toLowerCase()

  // For now, return a placeholder with the product info
  // In production, you could integrate with image search APIs
  return `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(searchTerms)}`
}

// Execute the function
fetchCsvData().then(({ products, categories }) => {
  console.log("Final product count:", products.length)
  console.log("Final categories:", categories)

  // Analyze margin categories
  const marginAnalysis = {
    high: products.filter((p) => p.marginCategory === "high").length,
    medium: products.filter((p) => p.marginCategory === "medium").length,
    small: products.filter((p) => p.marginCategory === "small").length,
  }

  console.log("Margin-based pricing analysis:", marginAnalysis)

  // Category-wise margin analysis
  const categoryMargins = {}
  products.forEach((product) => {
    if (!categoryMargins[product.category]) {
      categoryMargins[product.category] = { total: 0, high: 0, medium: 0, small: 0 }
    }
    categoryMargins[product.category].total++
    categoryMargins[product.category][product.marginCategory]++
  })

  console.log("Category-wise margin analysis:", categoryMargins)
})
