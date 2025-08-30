"use client"

import { useState, useEffect } from 'react'
import { Download, Copy, MessageCircle, Check, ArrowLeft, Phone, MapPin, Package, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import { useShipping } from '@/hooks/use-shipping'
import jsPDF from 'jspdf'

export default function OrderSummaryPage() {
  const { cart, getCartTotal, getCartItemCount, clearCart } = useCart()
  const { shippingInfo } = useShipping()
  const [orderNumber, setOrderNumber] = useState('')
  const [copied, setCopied] = useState(false)
  const [whatsappSent, setWhatsappSent] = useState(false)

  useEffect(() => {
    // Get order number from localStorage or generate new one
    const savedOrderNumber = localStorage.getItem('urbancrate-order-number')
    if (savedOrderNumber) {
      setOrderNumber(savedOrderNumber)
    } else {
      const orderNum = `UC${Date.now().toString().slice(-6)}`
      setOrderNumber(orderNum)
    }
    
    // Get WhatsApp status from localStorage
    const savedWhatsappStatus = localStorage.getItem('urbancrate-whatsapp-sent') === 'true'
    setWhatsappSent(savedWhatsappStatus)
  }, [])

  const generateOrderText = () => {
    const orderDate = new Date().toLocaleDateString('en-IN')
    let orderText = `🛒 *Urban Crate Order Confirmation*\n\n`
    orderText += `📋 Order #: ${orderNumber}\n`
    orderText += `📅 Date: ${orderDate}\n`
    orderText += `✅ Status: Order Confirmed via WhatsApp\n\n`
    
    orderText += `👤 *Customer Details:*\n`
    orderText += `Name: ${shippingInfo.name}\n`
    orderText += `Phone: ${shippingInfo.phone}\n`
    orderText += `Address: ${shippingInfo.address}\n`
    orderText += `City: ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.pincode}\n\n`
    
    orderText += `📦 *Items Ordered:*\n`
    
    cart.forEach((item, index) => {
      orderText += `${index + 1}. ${item.name}\n`
      orderText += `   Brand: ${item.brand}\n`
      orderText += `   Quantity: ${item.cartQuantity} x ₹${item.buyPrice}\n`
      orderText += `   Subtotal: ₹${item.cartQuantity * item.buyPrice}\n\n`
    })
    
    orderText += `💰 *Total Amount: ₹${getCartTotal()}*\n`
    orderText += `📱 *Order Method: WhatsApp*\n`
    orderText += `💳 *Payment: As per instructions received*\n\n`
    
    orderText += `✅ *Order Status:*\n`
    orderText += `• Order confirmed and sent to team\n`
    orderText += `• You will receive delivery confirmation soon\n`
    orderText += `• Expected delivery: 2-3 hours\n\n`
    
    orderText += `Thank you for choosing Urban Crate! 🙏`
    
    return orderText
  }

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(generateOrderText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    let yPosition = 20

    // Header
    doc.setFontSize(20)
    doc.text('Urban Crate', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10
    
    doc.setFontSize(16)
    doc.text('Order Confirmation', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // Order details
    doc.setFontSize(12)
    doc.text(`Order #: ${orderNumber}`, 20, yPosition)
    yPosition += 10
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, yPosition)
    yPosition += 10
    doc.text('Status: Confirmed via WhatsApp', 20, yPosition)
    yPosition += 20

    // Customer details
    doc.setFontSize(14)
    doc.text('Customer Details:', 20, yPosition)
    yPosition += 10
    doc.setFontSize(10)
    doc.text(`Name: ${shippingInfo.name}`, 20, yPosition)
    yPosition += 5
    doc.text(`Phone: ${shippingInfo.phone}`, 20, yPosition)
    yPosition += 5
    doc.text(`Address: ${shippingInfo.address}`, 20, yPosition)
    yPosition += 5
    doc.text(`City: ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.pincode}`, 20, yPosition)
    yPosition += 15

    // Items
    doc.setFontSize(14)
    doc.text('Items Ordered:', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    cart.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name}`, 20, yPosition)
      yPosition += 5
      doc.text(`   Brand: ${item.brand}`, 25, yPosition)
      yPosition += 5
      doc.text(`   Qty: ${item.cartQuantity} x ₹${item.buyPrice} = ₹${item.cartQuantity * item.buyPrice}`, 25, yPosition)
      yPosition += 10
    })

    // Total
    yPosition += 10
    doc.setFontSize(14)
    doc.text(`Total Amount: ₹${getCartTotal()}`, 20, yPosition)
    yPosition += 10
    doc.text('Order Method: WhatsApp', 20, yPosition)

    doc.save(`UrbanCrate-Order-${orderNumber}.pdf`)
  }

  const handleContactSupport = () => {
    const supportMessage = `Hi! I need help with my Urban Crate order #${orderNumber}. Order total: ₹${getCartTotal()}`
    const encodedText = encodeURIComponent(supportMessage)
    const whatsappUrl = `https://wa.me/918076234610?text=${encodedText}`
    window.open(whatsappUrl, '_blank')
  }

  const handleNewOrder = () => {
    clearCart()
    // Clear order data from localStorage
    localStorage.removeItem('urbancrate-payment-method')
    localStorage.removeItem('urbancrate-whatsapp-sent')
    localStorage.removeItem('urbancrate-order-number')
    window.location.href = '/catalog'
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No order found</h1>
          <Link href="/catalog">
            <Button className="bg-green-600 hover:bg-green-700">
              Start Shopping
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
          <Link href="/catalog" className="flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Success Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-sm sm:text-base">Order #{orderNumber}</p>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge className="bg-green-100 text-green-800">
              <MessageCircle className="w-3 h-3 mr-1" />
              Sent via WhatsApp
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Clock className="w-3 h-3 mr-1" />
              Delivery: 2-3 hours
            </Badge>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Order Status */}
          <Card className="border-green-100 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Order Successfully Confirmed!</h3>
                  <p className="text-sm text-green-700">
                    Your order has been sent via WhatsApp and automatically confirmed. 
                    Our team will contact you shortly with delivery details and payment instructions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items - Mobile Optimized */}
          <Card className="border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Package className="w-5 h-5 mr-2" />
                Order Items ({getCartItemCount()})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <img
                    src={`https://images.unsplash.com/photo-1542838132-92c53300491e?w=50&h=50&fit=crop&crop=center`}
                    alt={item.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">{item.brand}</p>
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-600">{item.quantity}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium">₹{item.buyPrice} x {item.cartQuantity}</span>
                      <span className="text-sm sm:text-base font-bold text-green-600">₹{item.cartQuantity * item.buyPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-sm sm:text-base">{shippingInfo.name}</p>
                <div className="flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-1 text-gray-600" />
                  <p className="text-gray-600 text-sm">{shippingInfo.phone}</p>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {shippingInfo.address}<br />
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.pincode}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{getCartTotal()}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <p>Order Method: WhatsApp</p>
                <p>Status: ✅ Confirmed Automatically</p>
                <p>Payment: As per team instructions</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleContactSupport}
                className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleCopyOrder}
                  variant="outline"
                  className="border-green-200 hover:bg-green-50 text-xs sm:text-sm"
                >
                  {copied ? (
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="border-green-200 hover:bg-green-50 text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  PDF
                </Button>
              </div>
              
              <Button
                onClick={handleNewOrder}
                className="w-full bg-orange-500 hover:bg-orange-600 text-sm sm:text-base"
              >
                Place New Order
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
            <p className="text-sm text-green-800 font-medium">
              📦 Your order has been confirmed and sent to our team
            </p>
            <p className="text-xs text-green-700 mt-1">
              Expected delivery: 2-3 hours • Updates on WhatsApp: {shippingInfo.phone}
            </p>
            <p className="text-xs text-green-600 mt-2 font-medium">
              ✅ No further action required - order automatically processed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
