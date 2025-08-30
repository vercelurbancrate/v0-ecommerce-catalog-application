"use client"

import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MINIMUM_ORDER_VALUE } from "@/lib/products-data"

interface MinimumOrderPopupProps {
  isOpen: boolean
  onClose: () => void
  currentTotal: number
  deficit: number
}

export function MinimumOrderPopup({ isOpen, onClose, currentTotal, deficit }: MinimumOrderPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 p-2 rounded-full">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Minimum Order Value</h3>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-gray-600">
            Minimum order value is <span className="font-semibold text-green-600">₹{MINIMUM_ORDER_VALUE}</span>
          </p>
          <p className="text-sm text-gray-500">
            Current cart total: <span className="font-medium">₹{currentTotal}</span>
          </p>
          <p className="text-sm text-orange-600 font-medium">Add ₹{deficit} more to proceed to checkout</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Continue Shopping
          </Button>
          <Button onClick={onClose} className="flex-1 bg-green-600 hover:bg-green-700">
            Add More Items
          </Button>
        </div>
      </div>
    </div>
  )
}
