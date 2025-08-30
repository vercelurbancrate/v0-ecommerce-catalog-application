"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface Product {
  id: string
  brand: string
  name: string
  quantity: string
  mrp: number
  sellingPrice: number // Changed from buyPrice to sellingPrice
  category: string
  imageUrl?: string
  isHighMargin?: boolean
  isMediumMargin?: boolean
  profitMarginRupees?: number
}

export interface CartItem extends Product {
  cartQuantity: number
}

const STORAGE_KEY = "urbancrate-cart-realtime"

// Global state for real-time updates across all components
let globalCart: CartItem[] = []
const globalListeners: Set<() => void> = new Set()

// Force update all components using this cart
const notifyAllListeners = () => {
  console.log("🔄 [CART] Notifying all listeners, count:", globalListeners.size)
  globalListeners.forEach((listener) => {
    try {
      listener()
    } catch (error) {
      console.error("❌ [CART] Listener error:", error)
    }
  })
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0)
  const listenerRef = useRef<() => void>()

  // Force update function
  const forceUpdate = useCallback(() => {
    setForceUpdateCounter((prev) => prev + 1)
    setCart([...globalCart]) // Create new array reference to force re-render
    console.log("🔄 [CART] Force update triggered, new cart:", globalCart)
  }, [])

  // Register this component for global updates
  useEffect(() => {
    listenerRef.current = forceUpdate
    globalListeners.add(forceUpdate)
    console.log("📝 [CART] Registered listener, total listeners:", globalListeners.size)

    return () => {
      if (listenerRef.current) {
        globalListeners.delete(listenerRef.current)
        console.log("🗑️ [CART] Unregistered listener, remaining:", globalListeners.size)
      }
    }
  }, [forceUpdate])

  // Initialize cart from localStorage
  useEffect(() => {
    console.log("🔄 [CART] Initializing cart...")
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          globalCart = parsedCart
          setCart([...parsedCart])
          console.log("✅ [CART] Loaded from storage:", parsedCart)
        }
      }
    } catch (error) {
      console.error("❌ [CART] Error loading:", error)
      localStorage.removeItem(STORAGE_KEY)
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage when global cart changes
  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalCart))
      console.log("💾 [CART] Saved to storage:", globalCart)
    } catch (error) {
      console.error("❌ [CART] Save error:", error)
    }
  }, [])

  const addToCart = useCallback(
    (product: Product) => {
      console.log("➕ [CART] Adding product:", product.name, "ID:", product.id, "Selling Price:", product.sellingPrice)

      // Find existing item in global cart
      const existingIndex = globalCart.findIndex((item) => item.id === product.id)

      if (existingIndex >= 0) {
        // Update existing item
        globalCart[existingIndex] = {
          ...globalCart[existingIndex],
          cartQuantity: globalCart[existingIndex].cartQuantity + 1,
        }
        console.log(
          "🔄 [CART] Updated existing item:",
          product.name,
          "New quantity:",
          globalCart[existingIndex].cartQuantity,
        )
      } else {
        // Add new item
        const newItem: CartItem = { ...product, cartQuantity: 1 }
        globalCart.push(newItem)
        console.log("🆕 [CART] Added new item:", product.name)
      }

      // Calculate totals for verification
      const totalItems = globalCart.reduce((sum, item) => sum + item.cartQuantity, 0)
      const uniqueItems = globalCart.length

      console.log("📈 [CART] New global cart state:", {
        uniqueItems,
        totalItems,
        items: globalCart.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.cartQuantity,
          price: item.sellingPrice,
        })),
      })

      // Save and notify all components
      saveToStorage()
      notifyAllListeners()
    },
    [saveToStorage],
  )

  const removeFromCart = useCallback(
    (productId: string, removeAll = false) => {
      console.log("➖ [CART] Removing product:", productId, "removeAll:", removeAll)

      const existingIndex = globalCart.findIndex((item) => item.id === productId)

      if (existingIndex === -1) {
        console.log("❌ [CART] Item not found:", productId)
        return
      }

      const existingItem = globalCart[existingIndex]

      if (removeAll || existingItem.cartQuantity <= 1) {
        // Remove completely
        globalCart.splice(existingIndex, 1)
        console.log("🗑️ [CART] Removed completely:", productId)
      } else {
        // Decrease quantity
        globalCart[existingIndex] = {
          ...existingItem,
          cartQuantity: existingItem.cartQuantity - 1,
        }
        console.log("⬇️ [CART] Decreased quantity:", productId, "New qty:", globalCart[existingIndex].cartQuantity)
      }

      const totalItems = globalCart.reduce((sum, item) => sum + item.cartQuantity, 0)
      console.log("📉 [CART] After removal - Total items:", totalItems)

      // Save and notify all components
      saveToStorage()
      notifyAllListeners()
    },
    [saveToStorage],
  )

  const clearCart = useCallback(() => {
    console.log("🧹 [CART] Clearing cart")
    globalCart.length = 0 // Clear array while keeping reference
    localStorage.removeItem(STORAGE_KEY)
    notifyAllListeners()
  }, [])

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = globalCart.find((item) => item.id === productId)
      const quantity = item ? item.cartQuantity : 0
      return quantity
    },
    [forceUpdateCounter],
  ) // Depend on force update counter

  const getCartTotal = useCallback((): number => {
    const total = globalCart.reduce((sum, item) => sum + item.sellingPrice * item.cartQuantity, 0)
    console.log("💰 [CART] Calculating total with selling prices:", {
      items: globalCart.map((item) => ({
        name: item.name,
        price: item.sellingPrice,
        qty: item.cartQuantity,
        subtotal: item.sellingPrice * item.cartQuantity,
      })),
      total,
    })
    return total
  }, [forceUpdateCounter])

  const getCartItemCount = useCallback((): number => {
    const count = globalCart.reduce((sum, item) => sum + item.cartQuantity, 0)
    console.log("🔢 [CART] Calculating total count:", {
      cartLength: globalCart.length,
      items: globalCart.map((item) => ({ id: item.id, qty: item.cartQuantity })),
      totalCount: count,
      forceUpdateCounter,
    })
    return count
  }, [forceUpdateCounter])

  // Sync local state with global state
  useEffect(() => {
    setCart([...globalCart])
  }, [forceUpdateCounter])

  return {
    cart: globalCart, // Return global cart directly for real-time updates
    addToCart,
    removeFromCart,
    clearCart,
    getItemQuantity,
    getCartTotal,
    getCartItemCount,
    isInitialized,
  }
}
