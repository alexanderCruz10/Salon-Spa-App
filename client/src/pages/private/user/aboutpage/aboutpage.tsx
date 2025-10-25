import { useNavigate } from 'react-router-dom';
import UserNavBar from '@/components/UserNavBar';

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-700">
      {/* Navigation Menu */}
      <UserNavBar />

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6 text-center">
              About Zenpoint Salon & Spa
            </h1>
            <p className="text-xl text-gray-700 text-center italic">
              Serving the Greater Toronto Area with Excellence Since 2010
            </p>
          </div>

          {/* Our Story Section */}
          <div className="bg-green-100 rounded-lg p-8 md:p-10 mb-8">
            <h2 className="text-3xl font-bold text-green-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                For over a decade, Zenpoint Salon & Spa has been the premier destination for beauty and wellness throughout the Greater Toronto Area. What started as a small boutique salon in downtown Toronto has blossomed into a trusted network of professional establishments serving communities across the GTA.
              </p>
              <p>
                Our journey began with a simple vision: to create a welcoming space where everyone could experience top-tier salon and spa services without the premium downtown prices. We believed that quality beauty care should be accessible to all neighborhoods—from Mississauga to Markham, Brampton to Burlington, and everywhere in between.
              </p>
              <p>
                Today, we're proud to partner with the finest salons and spas across the region, each hand-selected for their commitment to excellence, professionalism, and customer satisfaction. Our platform connects you with certified stylists, aestheticians, and wellness professionals who understand the diverse beauty needs of the GTA's vibrant, multicultural community.
              </p>
            </div>
          </div>

          {/* Image Gallery Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Our GTA Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Image 1 */}
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-6xl mb-2">🏙️</p>
                    <p className="text-xl font-semibold">Downtown Toronto</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">Our flagship location in the heart of the city</p>
                </div>
              </div>

              {/* Image 2 */}
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-6xl mb-2">🌆</p>
                    <p className="text-xl font-semibold">Mississauga</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">Modern facilities in Canada's sixth largest city</p>
                </div>
              </div>

              {/* Image 3 */}
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-6xl mb-2">🏢</p>
                    <p className="text-xl font-semibold">Markham</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">Serving the vibrant communities of York Region</p>
                </div>
              </div>

              {/* Image 4 */}
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-6xl mb-2">🌸</p>
                    <p className="text-xl font-semibold">Brampton</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">Bringing beauty services to Peel Region</p>
                </div>
              </div>

              {/* Image 5 */}
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-teal-300 to-teal-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-6xl mb-2">🌊</p>
                    <p className="text-xl font-semibold">Burlington</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">Lakeside luxury and relaxation</p>
                </div>
              </div>

              {/* Image 6 */}
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-6xl mb-2">✨</p>
                    <p className="text-xl font-semibold">Vaughan</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">Premium services in York Region</p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-lg p-8 md:p-10 mb-8 shadow-lg">
            <h2 className="text-3xl font-bold text-green-900 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-4">💚</div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Quality</h3>
                <p className="text-gray-600">We partner only with certified professionals who meet our high standards</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Community</h3>
                <p className="text-gray-600">Supporting local businesses and serving diverse GTA neighborhoods</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Excellence</h3>
                <p className="text-gray-600">Committed to providing exceptional experiences every visit</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-green-800 rounded-lg p-8 md:p-10 text-white text-center shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Join Thousands of Satisfied Customers</h2>
            <p className="text-lg mb-6">
              Experience the Zenpoint difference at a location near you across the GTA
            </p>
            <button 
              onClick={() => navigate('/salons')}
              className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition-colors text-lg"
            >
              Find a Salon Near You
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
