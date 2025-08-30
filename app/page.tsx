import Link from 'next/link'
import { ShoppingCart, Truck, Star, ArrowRight, Leaf, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { categories } from '@/lib/products-data'

export default function HomePage() {
  // Get all categories for display
  const allCategories = categories

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between flex-row items-center shadow-lg">
          <div className="flex items-center space-x-2">
            <img 
              src="/images/urban-crate-logo.png" 
              alt="Urban Crate Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold">
                <span className="text-green-600">Urban</span>
                <span className="text-orange-500">Crate</span>
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">{"One Stop Store"}</p>
            </div>
          </div>
          <Link href="/catalog">
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 sm:px-4">
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">View </span>Catalog
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="container mx-auto px-4 py-6 sm:py-12 text-center bg-white shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Crazy Low Prices.<br className="sm:hidden" /> No Markups. No Taxes.
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-2">
            Straight to your door.
          </p>
          <p className="text-sm sm:text-lg text-gray-500 mb-6 sm:mb-8">
            Premium spices, groceries, and daily essentials at wholesale prices
          </p>
          
          <Link href="/catalog">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto">
              Start Shopping
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section - Mobile First */}
      <section className="container mx-auto px-4 py-6 sm:py-8 shadow-md">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Shop by Category</h3>
          <p className="text-sm sm:text-base text-gray-600">Browse our wide range of products</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {allCategories.map((category, index) => (
            <Link key={category} href={`/catalog?category=${encodeURIComponent(category)}`}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-green-100 h-full hover:scale-105">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-lg sm:text-2xl">
                      {[
                        '🍰', '🍿', '🌾', '🧴', '🔋', '🧼', '🦷', '👩', '🥣', '🥛', 
                        '🌶️', '☕', '💐', '🧴', '🛢️', '🍯', '🍪', '🍜', '💊', '👶', 
                        '🏠', '🧊'
                      ][index % 22]}
                    </span>
                  </div>
                  <h4 className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 leading-tight">
                    {category}
                  </h4>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Link href="/catalog">
            <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50 px-6">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features - Mobile Optimized */}
      <section className="container mx-auto px-4 py-6 sm:py-12">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">Hand-picked spices and groceries from trusted suppliers</p>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">Quick and reliable delivery straight to your doorstep</p>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm sm:col-span-1 col-span-2 mx-auto max-w-sm sm:max-w-none">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Easy Ordering</h3>
            <p className="text-sm text-gray-600">Simple catalog browsing with WhatsApp order sharing</p>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="bg-gradient-to-r from-green-600 to-orange-500 py-8 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Save on Your Grocery Shopping?
          </h3>
          <p className="text-base sm:text-lg text-green-100 mb-6 sm:mb-8">
            Browse our extensive catalog of spices, groceries, and daily essentials
          </p>
          <Link href="/catalog">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto">
              Start Shopping Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
