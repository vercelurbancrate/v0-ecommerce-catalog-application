"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface LoaderStats {
  totalProducts: number
  categories: string[]
  highMarginCount: number
  mediumMarginCount: number
  lowMarginCount: number
}

export function CSVDataLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<LoaderStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCSVData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Run the CSV fetch script
      const response = await fetch("/api/load-csv-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to load CSV data")
      }

      const result = await response.json()
      setStats(result.stats)

      // Refresh the page to show new data
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          CSV Data Loader
        </CardTitle>
        <CardDescription>Load all products from your CSV file into the application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {stats && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-700 text-sm">Data loaded successfully!</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-gray-900">{stats.categories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-amber-100 text-amber-800">High Margin: {stats.highMarginCount}</Badge>
              <Badge className="bg-blue-100 text-blue-800">Medium Margin: {stats.mediumMarginCount}</Badge>
              <Badge className="bg-gray-100 text-gray-800">Low Margin: {stats.lowMarginCount}</Badge>
            </div>
          </div>
        )}

        <Button onClick={loadCSVData} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Loading CSV Data...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Load Products from CSV
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• This will fetch data from: DeliveryLads_Upload_selling price.csv</p>
          <p>• Products will be categorized by margin: High (≥₹100), Medium (₹50-₹99), Low (&lt;₹50)</p>
          <p>• Minimum order value will be set to ₹999</p>
        </div>
      </CardContent>
    </Card>
  )
}
