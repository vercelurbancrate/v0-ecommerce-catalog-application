import { CSVDataLoader } from "@/components/csv-data-loader"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your product catalog and data</p>
        </div>

        <CSVDataLoader />
      </div>
    </div>
  )
}
