"use client"

import { useCart } from '@/hooks/use-cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

export function CartDebug() {
  const { cart, getCartItemCount, getCartTotal, clearCart, isInitialized } = useCart()
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Update timestamp when cart changes
  useEffect(() => {
    setLastUpdate(new Date())
  }, [cart])

  if (!isInitialized) {
    return (
      <Card className="fixed bottom-4 left-4 w-80 z-50 bg-yellow-50 border-2 border-yellow-500">
        <CardContent className="p-4 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-yellow-700">Loading cart debug...</div>
        </CardContent>
      </Card>
    )
  }

  const totalCount = getCartItemCount()
  const uniqueItems = cart.length
  const expectedTotal = cart.reduce((sum, item) => sum + item.cartQuantity, 0)

  return (
    <Card className="fixed bottom-4 left-4 w-96 max-h-[80vh] overflow-auto z-50 bg-white border-2 border-red-500 shadow-xl">
      <CardHeader className="pb-2 bg-red-50">
        <CardTitle className="text-sm text-red-600 flex items-center justify-between">
          🐛 Real-Time Cart Debug
          <Badge variant="secondary" className="text-xs animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-3 p-4">
        {/* Real-time Status */}
        <div className="bg-green-100 border border-green-300 p-2 rounded">
          <div className="font-bold text-green-800">⚡ REAL-TIME MODE</div>
          <div className="text-green-700">
            Last Update: {lastUpdate.toLocaleTimeString()}<br/>
            Updates: Instant (no refresh needed)
          </div>
        </div>

        {/* Critical Issue Detection */}
        {uniqueItems > 0 && totalCount !== expectedTotal && (
          <div className="bg-red-100 border border-red-300 p-2 rounded animate-pulse">
            <div className="font-bold text-red-800">🚨 BUG DETECTED!</div>
            <div className="text-red-700">
              Expected: {expectedTotal}<br/>
              Actual: {totalCount}<br/>
              Difference: {Math.abs(expectedTotal - totalCount)}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded">
          <div className="font-semibold">
            Unique Items: <span className="text-blue-600">{uniqueItems}</span>
          </div>
          <div className="font-semibold">
            Total Quantity: <span className="text-green-600 text-lg font-bold">{totalCount}</span>
          </div>
          <div className="font-semibold">
            Total Value: <span className="text-purple-600">₹{getCartTotal()}</span>
          </div>
          <div className="font-semibold">
            Status: <span className="text-green-600">✅ Real-Time</span>
          </div>
        </div>
        
        {/* Real-time Test */}
        <div className="border-t pt-2">
          <div className="font-semibold mb-2 text-blue-600">🧪 Real-Time Test:</div>
          <div className="text-xs text-gray-700 space-y-1">
            <div>1. Click any "Add" button</div>
            <div>2. Watch numbers update instantly</div>
            <div>3. No page refresh needed</div>
            <div className="font-semibold text-green-600">
              {totalCount > 0 ? '✅ Working!' : '⏳ Add items to test'}
            </div>
          </div>
        </div>
        
        {/* Cart Items Detail */}
        <div className="border-t pt-2">
          <div className="font-semibold mb-2 flex items-center justify-between">
            <span>📦 Live Cart Contents:</span>
            {cart.length > 0 && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                {cart.length} items
              </Badge>
            )}
          </div>
          {cart.length === 0 ? (
            <div className="text-gray-500 italic p-2 bg-gray-50 rounded">
              Cart is empty - add products to see real-time updates!
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={item.id} className="bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                  <div className="font-medium text-blue-900 truncate" title={item.name}>
                    {index + 1}. {item.name}
                  </div>
                  <div className="text-gray-600 text-xs mt-1">
                    <span className="inline-block mr-2">ID: {item.id}</span>
                    <span className="inline-block mr-2 font-semibold text-green-600">Qty: {item.cartQuantity}</span>
                    <span className="inline-block font-semibold text-purple-600">₹{item.buyPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Manual Verification */}
        <div className="border-t pt-2 bg-yellow-50 p-2 rounded">
          <div className="font-semibold text-yellow-800 mb-1">🧮 Manual Verification:</div>
          <div className="text-xs text-yellow-700">
            {cart.length > 0 ? (
              <>
                {cart.map(item => item.cartQuantity).join(' + ')} = {expectedTotal}
                <br/>
                Function returns: {totalCount}
                <br/>
                {expectedTotal === totalCount ? (
                  <span className="text-green-600 font-bold">✅ CORRECT!</span>
                ) : (
                  <span className="text-red-600 font-bold">❌ MISMATCH!</span>
                )}
              </>
            ) : (
              'No items to verify'
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="border-t pt-2 space-y-2">
          <Button 
            onClick={clearCart} 
            size="sm" 
            variant="destructive" 
            className="w-full text-xs"
            disabled={cart.length === 0}
          >
            🗑️ Clear Cart ({cart.length} items)
          </Button>
          
          <div className="text-xs text-gray-500 text-center">
            Press Ctrl+Shift+D to hide • Real-time updates active
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
