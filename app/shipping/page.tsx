"use client"

import { useState } from 'react'
import { ArrowLeft, User, Phone, MapPin, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { useShipping } from '@/hooks/use-shipping'

export default function ShippingPage() {
  const router = useRouter()
  const { cart, getCartTotal, getCartItemCount } = useCart()
  const { shippingInfo, setShippingInfo } = useShipping()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!shippingInfo.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Address is required'
    }
    
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'City is required'
    }
    
    if (!shippingInfo.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(shippingInfo.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      router.push('/payment')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo({ ...shippingInfo, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No items in cart</h1>
          <Link href="/catalog">
            <Button className="bg-green-600 hover:bg-green-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <Link href="/cart" className="flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">Back to Cart</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Shipping Information</h1>
        
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <Card className="border-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`border-green-200 focus:border-green-500 text-sm ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`border-green-200 focus:border-green-500 text-sm ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="text-sm">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`border-green-200 focus:border-green-500 text-sm ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="Enter your complete address"
                      rows={3}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`border-green-200 focus:border-green-500 text-sm ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="state" className="text-sm">State</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="border-green-200 focus:border-green-500 text-sm"
                        placeholder="State"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pincode" className="text-sm">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={shippingInfo.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className={`border-green-200 focus:border-green-500 text-sm ${errors.pincode ? 'border-red-500' : ''}`}
                        placeholder="Pincode"
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
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
                
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2" />
                    <span>Free delivery available</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-2" />
                    <span>Order updates via WhatsApp</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
