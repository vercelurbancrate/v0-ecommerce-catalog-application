"use client"

import { useState } from 'react'
import { ArrowLeft, Copy, Check, CreditCard, MessageCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { useShipping } from '@/hooks/use-shipping'

export default function PaymentPage() {
  const router = useRouter()
  const { cart, getCartTotal, getCartItemCount } = useCart()
  const { shippingInfo } = useShipping()
  const [upiCopied, setUpiCopied] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'whatsapp' | 'upi'>('whatsapp')
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [whatsappSent, setWhatsappSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const upiId = "vrahulv695@oksbi"
  const totalAmount = getCartTotal()
  const customerWhatsApp = '918076234610' // Customer support

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setUpiCopied(true)
    setTimeout(() => setUpiCopied(false), 2000)
  }

  const generateOrderSummary = () => {
    const orderDate = new Date().toLocaleDateString('en-IN')
    const orderTime = new Date().toLocaleTimeString('en-IN')
    const orderNumber = `UC${Date.now().toString().slice(-6)}`
    
    let orderText = `🛒 *Urban Crate Order Request*\n\n`
    orderText += `📋 Order #: ${orderNumber}\n`
    orderText += `📅 Date: ${orderDate} at ${orderTime}\n`
    orderText += `💰 Total Amount: ₹${totalAmount}\n\n`
    
    orderText += `👤 *Customer Details:*\n`
    orderText += `Name: ${shippingInfo.name}\n`
    orderText += `Phone: ${shippingInfo.phone}\n`
    orderText += `Address: ${shippingInfo.address}\n`
    orderText += `City: ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.pincode}\n\n`
    
    orderText += `📦 *Items Ordered (${getCartItemCount()}):*\n`
    cart.forEach((item, index) => {
      orderText += `${index + 1}. ${item.name}\n`
      orderText += `   Brand: ${item.brand}\n`
      orderText += `   Qty: ${item.cartQuantity} x ₹${item.buyPrice} = ₹${item.cartQuantity * item.buyPrice}\n\n`
    })
    
    orderText += `💳 *Payment Details:*\n`
    orderText += `UPI ID: ${upiId}\n`
    orderText += `Amount to Pay: ₹${totalAmount}\n\n`
    
    orderText += `Please confirm this order and provide delivery details. Thank you! 🙏`
    
    // Store order number for later use
    localStorage.setItem('urbancrate-order-number', orderNumber)
    
    return orderText
  }

const handleWhatsAppOrder = () => {
  setPaymentStatus('processing')
  setErrorMessage('')
  
  try {
    // Generate order message
    const orderMessage = generateOrderSummary()
    
    // Create WhatsApp link
    const encodedMessage = encodeURIComponent(orderMessage)
    const whatsappUrl = `https://wa.me/${customerWhatsApp}?text=${encodedMessage}`
    
    // Store the WhatsApp URL for fallback
    localStorage.setItem('urbancrate-whatsapp-url', whatsappUrl)
    
    // Try to open WhatsApp - use different approaches for better compatibility
    let whatsappOpened = false
    
    // Method 1: Try window.open with specific parameters
    try {
      const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer,width=400,height=600')
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappOpened = true
      }
    } catch (e) {
      console.log('Method 1 failed, trying method 2')
    }
    
    // Method 2: Try direct location assignment if method 1 failed
    if (!whatsappOpened) {
      try {
        // Create a temporary link and click it
        const link = document.createElement('a')
        link.href = whatsappUrl
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        whatsappOpened = true
      } catch (e) {
        console.log('Method 2 failed, trying method 3')
      }
    }
    
    // Method 3: Show manual link if all else fails
    if (!whatsappOpened) {
      setPaymentStatus('success')
      setWhatsappSent(true)
      localStorage.setItem('urbancrate-whatsapp-sent', 'true')
      localStorage.setItem('urbancrate-payment-method', 'whatsapp')
      return // Don't auto-redirect, let user manually open WhatsApp
    }
    
    // If WhatsApp opened successfully, mark as sent
    setWhatsappSent(true)
    setPaymentStatus('success')
    
    // Store WhatsApp status
    localStorage.setItem('urbancrate-whatsapp-sent', 'true')
    localStorage.setItem('urbancrate-payment-method', 'whatsapp')
    
    // Auto-redirect to order summary after 3 seconds (increased time)
    setTimeout(() => {
      router.push('/order-summary')
    }, 3000)
    
  } catch (error) {
    console.error('WhatsApp error:', error)
    // Even if there's an error, allow the user to proceed manually
    setPaymentStatus('success')
    setWhatsappSent(true)
    localStorage.setItem('urbancrate-whatsapp-sent', 'true')
    localStorage.setItem('urbancrate-payment-method', 'whatsapp')
    setErrorMessage('WhatsApp link is ready. Please use the manual link below if it didn\'t open automatically.')
  }
}

const handleManualWhatsApp = () => {
  const whatsappUrl = localStorage.getItem('urbancrate-whatsapp-url')
  if (whatsappUrl) {
    // Copy to clipboard as backup
    navigator.clipboard.writeText(whatsappUrl).catch(() => {})
    // Try to open
    window.location.href = whatsappUrl
  }
}

const handleCopyWhatsAppLink = () => {
  const whatsappUrl = localStorage.getItem('urbancrate-whatsapp-url')
  if (whatsappUrl) {
    navigator.clipboard.writeText(whatsappUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
}

  const handleUPIPayment = () => {
    try {
      const upiUrl = `upi://pay?pa=${upiId}&pn=Urban%20Crate&am=${totalAmount}&cu=INR&tn=Urban%20Crate%20Order%20Payment&mc=0000&tr=${Date.now()}`
      window.location.href = upiUrl
    } catch (error) {
      console.error('UPI error:', error)
      setErrorMessage('Failed to open UPI app. Please use WhatsApp order method.')
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
          <Link href="/shipping" className="flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">Back to Shipping</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Complete Your Order</h1>
        
        {/* Success Alert */}
        {paymentStatus === 'success' && whatsappSent && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              ✅ Order sent successfully! Redirecting to order confirmation...
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {paymentStatus === 'error' && errorMessage && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* WhatsApp Order - Primary and Required Method */}
            <Card className="border-2 border-green-500 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">WhatsApp Order</h3>
                      <p className="text-sm text-gray-600">Required to Complete Order</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Required</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
  <div className="space-y-4">
    <div className="bg-green-100 p-4 rounded-lg border border-green-200">
      <h4 className="font-semibold text-green-900 mb-2">📱 Order Process:</h4>
      <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
        <li>Click the button below to send your order via WhatsApp</li>
        <li>Your order details will be sent to our team</li>
        <li>Order will be automatically confirmed</li>
        <li>You'll receive payment and delivery instructions</li>
        <li>Delivery within 2-3 hours</li>
      </ul>
    </div>

    {errorMessage && (
      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <p className="text-yellow-800 text-sm font-medium">
          ⚠️ {errorMessage}
        </p>
      </div>
    )}
    
    <Button
      onClick={handleWhatsAppOrder}
      disabled={paymentStatus === 'processing'}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      size="lg"
    >
      {paymentStatus === 'processing' ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Opening WhatsApp...
        </>
      ) : whatsappSent ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Order Sent Successfully!
        </>
      ) : (
        <>
          <MessageCircle className="w-4 h-4 mr-2" />
          Send Order via WhatsApp
        </>
      )}
    </Button>

    {/* Manual WhatsApp options - shown after clicking */}
    {(whatsappSent || errorMessage) && (
      <div className="space-y-2 border-t pt-4">
        <p className="text-sm text-gray-600 font-medium">Alternative options:</p>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleManualWhatsApp}
            variant="outline"
            className="border-green-200 hover:bg-green-50 text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Open WhatsApp
          </Button>
          
          <Button
            onClick={handleCopyWhatsAppLink}
            variant="outline"
            className="border-green-200 hover:bg-green-50 text-xs"
          >
            {copied ? (
              <Check className="w-3 h-3 mr-1 text-green-600" />
            ) : (
              <Copy className="w-3 h-3 mr-1" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-blue-800 text-xs">
            💡 If WhatsApp didn't open automatically, use the buttons above or manually open WhatsApp and send a message to: <strong>+91 80762 34610</strong>
          </p>
        </div>
      </div>
    )}

    {whatsappSent && (
      <div className="bg-green-100 p-3 rounded-lg border border-green-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-800">
            <Check className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              Order confirmed! 
            </span>
          </div>
          <Button
            onClick={() => router.push('/order-summary')}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-xs"
          >
            Continue →
          </Button>
        </div>
        <p className="text-green-700 text-xs mt-1">
          Redirecting to confirmation page in a few seconds...
        </p>
      </div>
    )}
  </div>
</CardContent>
            </Card>

            {/* Alternative UPI Payment - Optional */}
            <Card className={`border-2 cursor-pointer transition-all ${
              selectedPaymentMethod === 'upi' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`} onClick={() => setSelectedPaymentMethod('upi')}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Direct UPI Payment</h3>
                      <p className="text-sm text-gray-600">Alternative Method</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Optional</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Payment Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-orange-800 text-sm">
                    <li>Copy the UPI ID below</li>
                    <li>Open your UPI app</li>
                    <li>Send ₹{totalAmount} to the UPI ID</li>
                    <li>Send payment screenshot via WhatsApp (still required)</li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID:
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white p-3 rounded border font-mono text-sm sm:text-base">
                      {upiId}
                    </code>
                    <Button
                      onClick={handleCopyUPI}
                      variant="outline"
                      className={`border-orange-200 hover:bg-orange-50 ${upiCopied ? "bg-orange-50 border-orange-200" : ""}`}
                    >
                      {upiCopied ? (
                        <Check className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleUPIPayment}
                  variant="outline"
                  className="w-full border-orange-200 hover:bg-orange-50"
                >
                  Open UPI App
                </Button>

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-xs">
                    ⚠️ Note: Even with direct UPI payment, you still need to send order details via WhatsApp above to complete your order.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Completion Status */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className={`flex items-center p-3 rounded-lg ${
                    whatsappSent 
                      ? 'bg-green-100 border border-green-200' 
                      : 'bg-gray-100 border border-gray-200'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      whatsappSent ? 'bg-green-600' : 'bg-gray-400'
                    }`}>
                      {whatsappSent ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-white text-sm">1</span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${whatsappSent ? 'text-green-800' : 'text-gray-600'}`}>
                        Send Order via WhatsApp
                      </p>
                      <p className={`text-sm ${whatsappSent ? 'text-green-600' : 'text-gray-500'}`}>
                        {whatsappSent ? 'Completed ✅' : 'Required to complete order'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center p-3 rounded-lg ${
                    whatsappSent 
                      ? 'bg-green-100 border border-green-200' 
                      : 'bg-gray-100 border border-gray-200'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      whatsappSent ? 'bg-green-600' : 'bg-gray-400'
                    }`}>
                      {whatsappSent ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-white text-sm">2</span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${whatsappSent ? 'text-green-800' : 'text-gray-600'}`}>
                        Order Confirmation
                      </p>
                      <p className={`text-sm ${whatsappSent ? 'text-green-600' : 'text-gray-500'}`}>
                        {whatsappSent ? 'Order confirmed automatically ✅' : 'Pending WhatsApp order'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Items ({getCartItemCount()})</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{totalAmount}</span>
                  </div>
                </div>
                
                {/* Shipping Info Summary */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Delivery Address:</h4>
                  <p className="text-green-700 text-sm">
                    {shippingInfo.name}<br />
                    {shippingInfo.phone}<br />
                    {shippingInfo.address}<br />
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.pincode}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <MessageCircle className="w-3 h-3 mr-2" />
                    <span>WhatsApp: {customerWhatsApp}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-3 h-3 mr-2" />
                    <span>UPI ID: {upiId}</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-3 h-3 mr-2" />
                    <span>Secure & Fast Delivery</span>
                  </div>
                </div>

                {/* Order Status in Summary */}
                <div className={`p-3 rounded-lg text-center ${
                  whatsappSent 
                    ? 'bg-green-100 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  {whatsappSent ? (
                    <div className="text-green-800">
                      <Check className="w-5 h-5 mx-auto mb-1" />
                      <p className="font-semibold text-sm">Order Confirmed!</p>
                      <p className="text-xs">Redirecting to confirmation...</p>
                    </div>
                  ) : (
                    <div className="text-yellow-800">
                      <MessageCircle className="w-5 h-5 mx-auto mb-1" />
                      <p className="font-semibold text-sm">WhatsApp Required</p>
                      <p className="text-xs">Send order to complete purchase</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
