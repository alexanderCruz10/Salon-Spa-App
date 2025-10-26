
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { salonAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import type { SalonFormData } from '@/types/salon'
import OwnerNavBar from '@/components/OwnerNavBar'

const AddSalon = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [newService, setNewService] = useState('')
  const [newServicePrice, setNewServicePrice] = useState('')

  const [formData, setFormData] = useState<SalonFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    services: [],
    openingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true },
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddService = () => {
    if (newService.trim() && !formData.services.some(s => s.name === newService.trim())) {
      const price = newServicePrice.trim() ? parseFloat(newServicePrice) : undefined;
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, { name: newService.trim(), price }],
      }))
      setNewService('')
      setNewServicePrice('')
    }
  }

  const handleRemoveService = (serviceName: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.name !== serviceName),
    }))
  }

  const handleHoursChange = (
    day: keyof SalonFormData['openingHours'],
    field: 'open' | 'close' | 'closed',
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Salon name is required')
      return
    }
    if (!formData.address.trim() || !formData.city.trim() || !formData.province.trim()) {
      toast.error('Complete address is required')
      return
    }
    if (formData.services.length === 0) {
      toast.error('Please add at least one service')
      return
    }

    setLoading(true)
    try {
      // Call the actual API
      await salonAPI.create(formData)
      
      toast.success('Salon added successfully!')
      navigate('/owner-dashboard')
    } catch (error) {
      console.error('Error adding salon:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add salon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Navigation Menu */}
      <OwnerNavBar />

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-900">Add New Salon</h1>
                <p className="text-gray-600 mt-2">Fill in the details to register your salon</p>
              </div>
              <div className="text-6xl">🏢</div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Salon Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter salon name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Describe your salon..."
                  />
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Los Angeles"
                  />
                </div>
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                    Province *
                  </label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="CA"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="90001"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="salon@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://www.yoursalon.com"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Services Offered *</h2>
              <div className="space-y-4">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Service name (e.g., Haircut, Manicure)"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                    className="w-full sm:w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Price ($)"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold whitespace-nowrap"
                  >
                    Add Service
                  </button>
                </div>
                {formData.services.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service) => (
                      <span
                        key={service.name}
                        className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full flex items-center gap-2"
                      >
                        {service.name}{service.price !== undefined && ` - $${service.price.toFixed(2)}`}
                        <button
                          type="button"
                          onClick={() => handleRemoveService(service.name)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Opening Hours</h2>
              <div className="space-y-4">
                {Object.entries(formData.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-32 font-medium text-gray-700 capitalize">{day}</div>
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleHoursChange(day as keyof SalonFormData['openingHours'], 'open', e.target.value)}
                        disabled={hours.closed}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleHoursChange(day as keyof SalonFormData['openingHours'], 'close', e.target.value)}
                        disabled={hours.closed}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={(e) => handleHoursChange(day as keyof SalonFormData['openingHours'], 'closed', e.target.checked)}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/owner-dashboard')}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Salon...' : 'Add Salon'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddSalon
