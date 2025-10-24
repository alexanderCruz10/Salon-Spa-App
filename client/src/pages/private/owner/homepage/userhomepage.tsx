import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

function UserHomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { clearUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      clearUser();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-green-700">
      {/* Navigation Menu */}
      <nav className={`p-4 shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-green-800 text-white' 
          : 'bg-green-300 text-green-900'
      }`}>
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold">Zenpoint Salon & Spa</h2>

          {/* Mobile toggle button */}
          <button
            className={`md:hidden p-2 rounded transition-colors ${
              scrolled ? 'bg-green-700' : 'bg-green-200'
            }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 mb-1 ${scrolled ? 'bg-white' : 'bg-green-900'}`} />
            <span className={`block w-6 h-0.5 mb-1 ${scrolled ? 'bg-white' : 'bg-green-900'}`} />
            <span className={`block w-6 h-0.5 ${scrolled ? 'bg-white' : 'bg-green-900'}`} />
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-6 items-center">
            <li>
              <Link to="/home" className={`transition-colors px-3 py-2 inline-block ${
                scrolled ? 'hover:text-green-300' : 'hover:text-green-700'
              }`}>Home</Link>
            </li>
            <li>
              <Link to="/salons" className={`transition-colors px-3 py-2 inline-block ${
                scrolled ? 'hover:text-green-300' : 'hover:text-green-700'
              }`}>Salons</Link>
            </li>
            <li>
              <Link to="/about" className={`transition-colors px-3 py-2 inline-block ${
                scrolled ? 'hover:text-green-300' : 'hover:text-green-700'
              }`}>About Us</Link>
            </li>
            <li>
              <Link to="/user-dashboard" className={`transition-colors px-3 py-2 inline-block ${
                scrolled ? 'hover:text-green-300' : 'hover:text-green-700'
              }`}>Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout} className={`transition-colors px-3 py-2 ${
                scrolled ? 'hover:text-green-300' : 'hover:text-green-700'
              }`}>Logout</button>
            </li>
          </ul>
        </div>

        {/* Mobile menu (collapsible) */}
        {mobileOpen && (
          <div className={`md:hidden transition-colors ${
            scrolled ? 'bg-green-700 text-white' : 'bg-green-200 text-green-900'
          }`}>
            <ul className="flex flex-col p-4 space-y-2">
              <li>
                <Link to="/home" className={`block px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'
                }`}>Home</Link>
              </li>
              <li>
                <Link to="/Salons" className={`block px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'
                }`}>Salons</Link>
              </li>
              <li>
                <Link to="/about" className={`block px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'
                }`}>About Us</Link>
              </li>
              <li>
                <Link to="/user-dashboard" className={`block px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'
                }`}>Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className={`block w-full text-left px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'
                }`}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </nav>

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
              placeholder="Enter your location or zip code"
              className="p-3 w-full sm:w-2/3 md:w-1/2 rounded border border-gray-300 text-gray-900"
            />
            <button className="p-3 px-6 w-full sm:w-auto rounded bg-green-700 text-white hover:bg-green-800 transition-colors font-semibold">
              Search
            </button>
          </div>
        </div>

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
