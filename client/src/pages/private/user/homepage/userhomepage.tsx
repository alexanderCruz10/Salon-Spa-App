import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { salonAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import UserNavBar from '@/components/UserNavBar';

function UserHomePage() {
  const [searchCity, setSearchCity] = useState('');
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchCity.trim()) {
      toast.error('Please enter a city name');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const response = await salonAPI.getAll({ city: searchCity.trim() });
      setSalons(response.data || []);
      
      if (response.data && response.data.length === 0) {
        toast.success(`No salons found in ${searchCity}`);
      } else {
        toast.success(`Found ${response.data?.length || 0} salon(s) in ${searchCity}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search salons');
      setSalons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchCity(value);
    
    // Clear results when input is empty
    if (value.trim() === '') {
      setSearched(false);
      setSalons([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-green-700">
      {/* Navigation Menu */}
      <UserNavBar />

      {/* Main Content */}
      <div className="p-4 md:p-8 space-y-6 text-center text-lg font-semibold">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            Welcome to Zenpoint Salon & Spa
          </h1>
          <p className="text-gray-700 text-base md:text-lg mb-6">
            Discover the perfect salon experience near you. Book appointments, browse services, and pamper yourself today!
          </p>
        </div>

        {/* Find a Salon Section */}
        <div className="bg-green-200 rounded-lg p-6 md:p-8">
          <h3 className="text-xl md:text-2xl text-green-900 mb-4">Find a Salon Near You</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <input
              type="text"
              placeholder="Enter city name..."
              value={searchCity}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="p-3 w-full sm:w-2/3 md:w-1/2 rounded border border-gray-300 text-gray-900"
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="p-3 px-6 w-full sm:w-auto rounded bg-green-700 text-white hover:bg-green-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-bold text-green-900 mb-4">
              Search Results {searchCity && `for "${searchCity}"`}
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">⏳</div>
                <p className="text-gray-600">Searching salons...</p>
              </div>
            ) : salons.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-600">No salons found in {searchCity}</p>
                <p className="text-gray-500 text-sm mt-2">Try searching for a different city</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salons.map((salon) => (
                  <div
                    key={salon._id}
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border border-green-200"
                  >
                    <h4 className="text-xl font-bold text-green-900 mb-2">{salon.name}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {salon.description || 'No description available'}
                    </p>
                    <div className="space-y-1 text-sm mb-4">
                      <p className="text-gray-700">
                        📍 {salon.city}, {salon.province}
                      </p>
                      {salon.address && (
                        <p className="text-gray-600">{salon.address}</p>
                      )}
                      {salon.phone && (
                        <p className="text-gray-700">📞 {salon.phone}</p>
                      )}
                    </div>
                    
                    {salon.services && salon.services.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-green-800 mb-2">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {salon.services.slice(0, 3).map((service: any, idx: number) => (
                            <span
                              key={idx}
                              className="bg-green-600 text-white px-2 py-1 rounded-full text-xs"
                            >
                              {typeof service === 'string' ? service : service.name}
                            </span>
                          ))}
                          {salon.services.length > 3 && (
                            <span className="text-green-700 text-xs self-center">
                              +{salon.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/salons/${salon._id}`)}
                      className="w-full bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Featured Services */}
        <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Popular Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">💇</div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">Haircuts & Styling</h3>
              <p className="text-gray-600 text-sm">Professional cuts and styles for all occasions</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">💆</div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">Spa Treatments</h3>
              <p className="text-gray-600 text-sm">Relax and rejuvenate with our spa services</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">💅</div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">Nail Care</h3>
              <p className="text-gray-600 text-sm">Manicures, pedicures, and nail art</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">Beauty Services</h3>
              <p className="text-gray-600 text-sm">Facials, makeup, and skincare treatments</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-green-800 rounded-lg p-8 mt-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-lg mb-6">Find your perfect salon and schedule an appointment today!</p>
          <button className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition-colors"
          onClick={() => navigate('/salons')}>
            Browse Salons
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;
