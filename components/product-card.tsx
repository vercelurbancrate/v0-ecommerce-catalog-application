"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { getMarginLabel } from "@/lib/products-data"
import type { Product } from "@/lib/products-data"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, getItemQuantity, isInitialized } = useCart()
  const [imageError, setImageError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Get quantity with real-time updates
  const quantity = getItemQuantity(product.id)

  // Log quantity changes for debugging
  useEffect(() => {
    console.log(`🔄 [PRODUCT] ${product.name} quantity updated to:`, quantity)
  }, [quantity, product.name])

  const handleAddToCart = async () => {
    if (isAdding) return // Prevent double clicks

    setIsAdding(true)
    console.log(`➕ [PRODUCT] Add clicked for ${product.name} (ID: ${product.id})`)

    try {
      addToCart(product)

      // Small delay to show visual feedback
      setTimeout(() => {
        setIsAdding(false)
      }, 100)
    } catch (error) {
      console.error("❌ [PRODUCT] Add error:", error)
      setIsAdding(false)
    }
  }

  const handleRemoveFromCart = async () => {
    console.log(`➖ [PRODUCT] Remove clicked for ${product.name} (ID: ${product.id})`)
    removeFromCart(product.id)
  }

  const getProductImageUrl = (product: Product) => {
    if (imageError) {
      return `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(product.brand)}`
    }
    return product.imageUrl
  }

  if (!isInitialized) {
    return (
      <Card className="overflow-hidden border-green-100 h-full animate-pulse">
        <div className="w-full h-24 sm:h-32 bg-gray-200"></div>
        <CardContent className="p-2 sm:p-3">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-7 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getCardClassName = () => {
    if (product.isHighMargin) {
      return `overflow-hidden hover:shadow-lg transition-all h-full bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-300 ${isAdding ? "ring-2 ring-amber-400" : ""}`
    } else if (product.isMediumMargin) {
      return `overflow-hidden hover:shadow-md transition-all h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 ${isAdding ? "ring-2 ring-blue-400" : ""}`
    } else {
      return `overflow-hidden hover:shadow-md transition-all border-green-100 h-full ${isAdding ? "ring-2 ring-green-400" : ""}`
    }
  }

  return (
    <Card className={getCardClassName()}>
      <div className="relative">
        <img
          src={getProductImageUrl(product) || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-24 sm:h-32 object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-1 left-1">
          <Badge className="bg-green-600 text-white text-xs px-1 py-0">{product.category.split(" ")[0]}</Badge>
        </div>
        {(product.isHighMargin || product.isMediumMargin) && (
          <div className="absolute top-1 right-1">
            <Badge
              className={`text-white text-xs px-1.5 py-0.5 font-bold shadow-md ${
                product.isHighMargin
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
              }`}
            >
              <Star className="w-2.5 h-2.5 mr-0.5" />
              {getMarginLabel(product)}
            </Badge>
          </div>
        )}
        {quantity > 0 && (
          <div
            className={`absolute ${product.isHighMargin || product.isMediumMargin ? "top-7 right-1" : "top-1 right-1"}`}
          >
            <Badge
              className={`text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 font-bold transition-all ${
                isAdding ? "bg-green-500 animate-pulse" : "bg-orange-500"
              }`}
            >
              {quantity}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-2 sm:p-3">
        <div className="mb-2">
          <p className="text-xs text-gray-600 font-medium">{product.brand}</p>
          <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
        </div>

        <div className="mb-2">
          <p className="text-xs text-gray-600">Qty: {product.quantity}</p>
          <div className="flex items-center justify-between">
            <div>
              <span
                className={`text-sm sm:text-base font-bold ${
                  product.isHighMargin ? "text-amber-600" : product.isMediumMargin ? "text-blue-600" : "text-green-600"
                }`}
              >
                ₹{product.sellingPrice}
              </span>
              {product.mrp !== product.sellingPrice && (
                <span className="text-xs text-gray-500 line-through ml-1">₹{product.mrp}</span>
              )}
            </div>
            {product.mrp !== product.sellingPrice && (
              <Badge
                variant="secondary"
                className={`text-xs px-1 py-0 ${
                  product.isHighMargin
                    ? "bg-amber-100 text-amber-800"
                    : product.isMediumMargin
                      ? "bg-blue-100 text-blue-800"
                      : "bg-orange-100 text-orange-800"
                }`}
              >
                {Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}% OFF
              </Badge>
            )}
          </div>
          {(product.isHighMargin || product.isMediumMargin) && (
            <div className="flex items-center mt-1">
              <TrendingUp className={`w-3 h-3 mr-1 ${product.isHighMargin ? "text-amber-600" : "text-blue-600"}`} />
              <span className={`text-xs font-medium ${product.isHighMargin ? "text-amber-700" : "text-blue-700"}`}>
                ₹{product.profitMarginRupees} margin
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {quantity === 0 ? (
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full text-xs py-1 h-7 transition-all ${
                product.isHighMargin
                  ? isAdding
                    ? "bg-amber-700 animate-pulse"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  : product.isMediumMargin
                    ? isAdding
                      ? "bg-blue-700 animate-pulse"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    : isAdding
                      ? "bg-green-700 animate-pulse"
                      : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <Plus className="w-3 h-3 mr-1" />
              {isAdding ? "Adding..." : "Add"}
            </Button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFromCart}
                className={`h-6 w-6 p-0 ${
                  product.isHighMargin
                    ? "border-amber-200 hover:bg-amber-50"
                    : product.isMediumMargin
                      ? "border-blue-200 hover:bg-blue-50"
                      : "border-green-200 hover:bg-green-50"
                }`}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span
                className={`font-semibold text-sm px-2 min-w-[2rem] text-center transition-all ${
                  isAdding
                    ? product.isHighMargin
                      ? "text-amber-600 animate-pulse"
                      : product.isMediumMargin
                        ? "text-blue-600 animate-pulse"
                        : "text-green-600 animate-pulse"
                    : ""
                }`}
              >
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`h-6 w-6 p-0 transition-all ${
                  product.isHighMargin
                    ? isAdding
                      ? "border-amber-400 bg-amber-50"
                      : "border-amber-200 hover:bg-amber-50"
                    : product.isMediumMargin
                      ? isAdding
                        ? "border-blue-400 bg-blue-50"
                        : "border-blue-200 hover:bg-blue-50"
                      : isAdding
                        ? "border-green-400 bg-green-50"
                        : "border-green-200 hover:bg-green-50"
                }`}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
