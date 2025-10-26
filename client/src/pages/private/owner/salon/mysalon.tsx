
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { salonAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import OwnerNavBar from '@/components/OwnerNavBar'
import type { Salon } from '@/types/salon'

function MySalon() {
  const navigate = useNavigate()
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMySalons()
  }, [])

  const fetchMySalons = async () => {
    try {
      setLoading(true)
      const response = await salonAPI.getOwnerSalons()
      setSalons(response.data || [])
    } catch (error) {
      console.error('Error fetching salons:', error)
      toast.error('Failed to load salons')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    
    try {
      await salonAPI.delete(id)
      toast.success('Salon deleted successfully!')
      fetchMySalons() // Refresh list
    } catch (error: any) {
      console.error('Error deleting salon:', error)
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to delete salon'
      toast.error(errorMessage)
    }
  }

  const handleReactivate = async (id: string, name: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Reactivate "${name}"?`)) return
    
    try {
      await salonAPI.update(id, { isActive: true } as any)
      toast.success('Salon reactivated successfully!')
      fetchMySalons() // Refresh list
    } catch (error: any) {
      console.error('Error reactivating salon:', error)
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to reactivate salon'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Navigation Menu */}
      <OwnerNavBar />

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-900">My Salons</h1>
                <p className="text-gray-600 mt-2">Manage your salon locations</p>
              </div>
              <Link
                to="/addsalon"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                + Add New Salon
              </Link>
            </div>
          </div>

          {/* Salons List */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-600 text-lg">Loading your salons...</p>
            </div>
          ) : salons.length === 0 ? (
            <div className="bg-white rounded-lg shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No salons yet</h2>
              <p className="text-gray-600 mb-6">Get started by adding your first salon</p>
              <Link
                to="/addsalon"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Add Your First Salon
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salons.map((salon) => (
                <div
                  key={salon._id}
                  className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  {/* Salon Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{salon.name}</h3>
                    <p className="text-indigo-100">
                      📍 {salon.city}, {salon.province}
                    </p>
                  </div>

                  {/* Salon Details */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {salon.description || 'No description provided'}
                    </p>

                    <div className="space-y-2 text-sm mb-4">
                      <p className="text-gray-700">
                        <span className="font-semibold">Address:</span> {salon.address}
                      </p>
                      {salon.phone && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Phone:</span> {salon.phone}
                        </p>
                      )}
                      {salon.email && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Email:</span> {salon.email}
                        </p>
                      )}
                    </div>

                    {/* Services */}
                    {salon.services && salon.services.length > 0 && (
                      <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-2">Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {salon.services.slice(0, 3).map((service, idx) => (
                            <span
                              key={idx}
                              className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs"
                            >
                              {typeof service === 'string' ? service : `${service.name}${service.price ? ` - $${service.price.toFixed(2)}` : ''}`}
                            </span>
                          ))}
                          {salon.services.length > 3 && (
                            <span className="text-gray-500 text-xs">
                              +{salon.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div className="mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          salon.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {salon.isActive ? '✓ Active' : '✗ Inactive'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/owner/salons/${salon._id}/edit`)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Edit
                      </button>
                      {salon.isActive ? (
                        <button
                          onClick={() => handleDelete(salon._id, salon.name)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(salon._id, salon.name)}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MySalon
