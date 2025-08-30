"use client"

import { useState, useMemo, useEffect } from 'react'
import { ShoppingCart, Filter, Search, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { products, categories } from '@/lib/products-data'
import { ProductCard } from '@/components/product-card'
import { CartDebug } from '@/components/cart-debug'

type SortOption = 'default' | 'price-low-high' | 'price-high-low' | 'name-a-z' | 'name-z-a' | 'discount-high-low'

export default function CatalogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const { getCartItemCount, isInitialized } = useCart()

  // Set initial category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  // Toggle debug panel with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebug(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    // First filter products
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })

    // Then sort products
    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.buyPrice - b.buyPrice)
        break
      case 'price-high-low':
        filtered.sort((a, b) => b.buyPrice - a.buyPrice)
        break
      case 'name-a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-z-a':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'discount-high-low':
        filtered.sort((a, b) => {
          const discountA = ((a.mrp - a.buyPrice) / a.mrp) * 100
          const discountB = ((b.mrp - b.buyPrice) / b.mrp) * 100
          return discountB - discountA
        })
        break
      default:
        // Keep original order
        break
    }

    return filtered
  }, [selectedCategory, searchQuery, sortBy])

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSortBy('default')
    router.push('/catalog')
  }

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'price-low-high': return 'Price: Low to High'
      case 'price-high-low': return 'Price: High to Low'
      case 'name-a-z': return 'Name: A to Z'
      case 'name-z-a': return 'Name: Z to A'
      case 'discount-high-low': return 'Discount: High to Low'
      default: return 'Default'
    }
  }

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'price-low-high': return <ArrowUp className="w-4 h-4" />
      case 'price-high-low': return <ArrowDown className="w-4 h-4" />
      case 'name-a-z': return <ArrowUp className="w-4 h-4" />
      case 'name-z-a': return <ArrowDown className="w-4 h-4" />
      case 'discount-high-low': return <ArrowDown className="w-4 h-4" />
      default: return <ArrowUpDown className="w-4 h-4" />
    }
  }

  const cartItemCount = getCartItemCount()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Panel */}
      {showDebug && <CartDebug />}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/images/urban-crate-logo.png" 
                alt="Urban Crate Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
              <span className="text-lg sm:text-xl font-bold">
                <span className="text-green-600">Urban</span>
                <span className="text-orange-500">Crate</span>
              </span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowDebug(!showDebug)}
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500"
              >
                🐛
              </Button>
              <Link href="/cart">
                <Button variant="outline" size="sm" className="relative border-green-200 hover:bg-green-50">
                  <ShoppingCart className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Cart</span>
                  {isInitialized && cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 font-bold">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Mobile Filters */}
        <div className="flex items-center gap-2 mb-4 sm:hidden">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-green-200 focus:border-green-500 text-sm"
              />
            </div>
          </div>
          
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                <Filter className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters & Sort</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-green-200 focus:border-green-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="border-green-200 focus:border-green-500">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                      <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                      <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                      <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                      <SelectItem value="discount-high-low">Discount: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(selectedCategory !== 'all' || searchQuery || sortBy !== 'default') && (
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="w-full border-green-200 hover:bg-green-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filters */}
        <div className="hidden sm:block mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-64 border-green-200 focus:border-green-500">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-64 border-green-200 focus:border-green-500">
                {getSortIcon(sortBy)}
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                <SelectItem value="discount-high-low">Discount: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            {(selectedCategory !== 'all' || searchQuery || sortBy !== 'default') && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="border-green-200 hover:bg-green-50"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== 'all' || searchQuery || sortBy !== 'default') && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {sortBy !== 'default' && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {getSortLabel(sortBy)}
                <button
                  onClick={() => setSortBy('default')}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
              {sortBy !== 'default' && (
                <span className="ml-2 text-blue-600 font-medium">
                  • Sorted by {getSortLabel(sortBy)}
                </span>
              )}
              {isInitialized && (
                <span className="ml-2 text-green-600 font-medium">
                  • Cart: {cartItemCount} items
                </span>
              )}
            </p>
            
            {/* Debug Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-xs text-gray-500">
                {isInitialized ? 'Cart Ready' : 'Loading...'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">
              Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Shift+D</kbd> to toggle debug panel
            </p>
            
            {showDebug && (
              <Badge className="bg-red-100 text-red-800 text-xs animate-pulse">
                🐛 Debug Mode Active
              </Badge>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
            <Button onClick={clearFilters} className="bg-green-600 hover:bg-green-700">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {isInitialized && cartItemCount > 0 && (
        <Link href="/cart">
          <Button className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-700 shadow-lg z-50 rounded-full w-14 h-14 sm:w-auto sm:h-auto sm:rounded-md sm:px-4 sm:py-2">
            <ShoppingCart className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Cart ({cartItemCount})</span>
            <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 sm:hidden font-bold">
              {cartItemCount}
            </Badge>
          </Button>
        </Link>
      )}
    </div>
  )
}
