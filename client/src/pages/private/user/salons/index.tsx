import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { salonAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import UserNavBar from '@/components/UserNavBar';

interface Salon {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  services: string[];
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
}

function SalonsPage() {
  const [searchCity, setSearchCity] = useState('');
  const [salons, setSalons] = useState<Salon[]>([]);
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllSalons();
  }, []);

  useEffect(() => {
    // Filter salons when search city changes
    if (searchCity.trim() === '') {
      setFilteredSalons(salons);
    } else {
      const filtered = salons.filter((salon) =>
        salon.city.toLowerCase().includes(searchCity.toLowerCase())
      );
      setFilteredSalons(filtered);
    }
  }, [searchCity, salons]);

  const fetchAllSalons = async () => {
    try {
      setLoading(true);
      const response = await salonAPI.getAll();
      const activeSalons = (response.data || []).filter((salon: Salon) => salon.isActive);
      setSalons(activeSalons);
      setFilteredSalons(activeSalons);
    } catch (error) {
      console.error('Error fetching salons:', error);
      toast.error('Failed to load salons');
      setSalons([]);
      setFilteredSalons([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800">
      {/* Navigation Menu */}
      <UserNavBar />

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
              Browse Salons & Spas
            </h1>
            <p className="text-gray-600 mb-6">
              Discover amazing salons and spas near you. Book your next appointment today!
            </p>

            {/* Search Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="citySearch" className="block text-sm font-semibold text-gray-700 mb-2">
                  🔍 Filter by City
                </label>
                <input
                  id="citySearch"
                  type="text"
                  placeholder="Enter city name..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {searchCity && (
                <div className="flex items-end">
                  <button
                    onClick={() => setSearchCity('')}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              {loading ? (
                'Loading salons...'
              ) : (
                <>
                  Showing {filteredSalons.length} of {salons.length} salon{salons.length !== 1 ? 's' : ''}
                  {searchCity && ` in "${searchCity}"`}
                </>
              )}
            </div>
          </div>

          {/* Salons Grid */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-600 text-lg">Loading salons...</p>
            </div>
          ) : filteredSalons.length === 0 ? (
            <div className="bg-white rounded-lg shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {searchCity ? `No salons found in "${searchCity}"` : 'No salons available'}
              </h2>
              <p className="text-gray-600 mb-6">
                {searchCity ? 'Try searching for a different city' : 'Check back later for new salons'}
              </p>
              {searchCity && (
                <button
                  onClick={() => setSearchCity('')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Show All Salons
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSalons.map((salon) => (
                <div
                  key={salon._id}
                  className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  {/* Salon Header */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{salon.name}</h3>
                    <p className="text-green-100">
                      📍 {salon.city}, {salon.province}
                    </p>
                  </div>

                  {/* Salon Details */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">
                      {salon.description || 'Experience premium salon and spa services'}
                    </p>

                    <div className="space-y-2 text-sm mb-4">
                      <p className="text-gray-700">
                        <span className="font-semibold">📍 Address:</span> {salon.address}
                      </p>
                      {salon.phone && (
                        <p className="text-gray-700">
                          <span className="font-semibold">📞 Phone:</span> {salon.phone}
                        </p>
                      )}
                      {salon.email && (
                        <p className="text-gray-700">
                          <span className="font-semibold">✉️ Email:</span> {salon.email}
                        </p>
                      )}
                      {salon.website && (
                        <p className="text-gray-700">
                          <span className="font-semibold">🌐 Website:</span>{' '}
                          <a
                            href={salon.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                          >
                            Visit
                          </a>
                        </p>
                      )}
                    </div>

                    {/* Services */}
                    {salon.services && salon.services.length > 0 && (
                      <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-2">Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {salon.services.slice(0, 4).map((service, idx) => (
                            <span
                              key={idx}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {service}
                            </span>
                          ))}
                          {salon.services.length > 4 && (
                            <span className="text-green-700 text-xs self-center font-medium">
                              +{salon.services.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    {salon.rating !== undefined && (
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-lg">⭐</span>
                          <span className="font-semibold text-gray-800 ml-1">
                            {salon.rating.toFixed(1)}
                          </span>
                        </div>
                        {salon.reviewCount !== undefined && (
                          <span className="text-gray-500 text-sm">
                            ({salon.reviewCount} review{salon.reviewCount !== 1 ? 's' : ''})
                          </span>
                        )}
                      </div>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/salons/${salon._id}`)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      View Details & Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalonsPage;
