import type { Product } from "./product-types" // Assuming Product type is declared in product-types.ts

export async function loadCompleteProductData(): Promise<Product[]> {
  try {
    // This would load the complete product array from the imported file
    // For now, returning the sample products from products-data.ts
    const { products } = await import("./products-data")
    return products
  } catch (error) {
    console.error("Error loading product data:", error)
    return []
  }
}

export function getProductsByCategory(category: string, allProducts: Product[]): Product[] {
  return allProducts.filter((product) => product.category === category)
}

export function getHighMarginProducts(allProducts: Product[]): Product[] {
  return allProducts.filter((product) => product.marginCategory === "high")
}

export function getMediumMarginProducts(allProducts: Product[]): Product[] {
  return allProducts.filter((product) => product.marginCategory === "medium")
}

export function getSmallMarginProducts(allProducts: Product[]): Product[] {
  return allProducts.filter((product) => product.marginCategory === "small")
}
