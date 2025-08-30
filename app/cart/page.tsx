"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const router = useRouter()
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartItemCount, isInitialized } = useCart()
  const [localCart, setLocalCart] = useState(cart)

  // Sync local cart with global cart state for real-time updates
  useEffect(() => {
    setLocalCart(cart)
    console.log("🔄 Cart page updated with new cart state:", cart)
  }, [cart])

  const handleProceedToCheckout = () => {
    if (localCart.length > 0) {
      router.push("/shipping")
    }
  }

  const handleAddItem = (item: any) => {
    console.log("➕ Adding item from cart page:", item.name)
    addToCart(item)
  }

  const handleRemoveItem = (itemId: string) => {
    console.log("➖ Removing item from cart page:", itemId)
    removeFromCart(itemId)
  }

  const handleRemoveAllItem = (itemId: string) => {
    console.log("🗑️ Removing all of item from cart page:", itemId)
    removeFromCart(itemId, true)
  }

  // Show loading state while cart is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <Link href="/catalog" className="flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm sm:text-base">Back to Catalog</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 sm:py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (localCart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <Link href="/catalog" className="flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm sm:text-base">Back to Catalog</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 sm:py-16 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6 sm:mb-8">Add some products to get started!</p>
          <Link href="/catalog">
            <Button className="bg-green-600 hover:bg-green-700">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <Link href="/catalog" className="flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">Back to Catalog</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Shopping Cart ({getCartItemCount()} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {localCart.map((item) => (
              <Card key={item.id} className="border-green-100">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <img
                      src={`https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop&crop=center`}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-1">{item.brand}</p>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">{item.quantity}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="border-green-200 hover:bg-green-50 h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold text-base w-8 text-center">{item.cartQuantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddItem(item)}
                            className="border-green-200 hover:bg-green-50 h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAllItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">₹{item.sellingPrice} each</span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{item.cartQuantity * item.sellingPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Items ({getCartItemCount()})</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>Total</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full border-green-200 hover:bg-green-50 text-sm bg-transparent"
                >
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
