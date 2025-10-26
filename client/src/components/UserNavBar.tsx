import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

function UserNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { clearUser } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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

  const isActive = (path: string) => location.pathname === path;

  return (
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
            <Link 
              to="/home" 
              className={`transition-colors px-3 py-2 inline-block ${
                isActive('/home') ? 'font-semibold' : ''
              } ${scrolled ? 'hover:text-green-300' : 'hover:text-green-700'}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/salons" 
              className={`transition-colors px-3 py-2 inline-block ${
                isActive('/salons') ? 'font-semibold' : ''
              } ${scrolled ? 'hover:text-green-300' : 'hover:text-green-700'}`}
            >
              Salons
            </Link>
          </li>
          <li>
            <Link 
              to="/my-bookings" 
              className={`transition-colors px-3 py-2 inline-block ${
                isActive('/my-bookings') ? 'font-semibold' : ''
              } ${scrolled ? 'hover:text-green-300' : 'hover:text-green-700'}`}
            >
              My Bookings
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`transition-colors px-3 py-2 inline-block ${
                isActive('/about') ? 'font-semibold' : ''
              } ${scrolled ? 'hover:text-green-300' : 'hover:text-green-700'}`}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link 
              to="/user-dashboard" 
              className={`transition-colors px-3 py-2 inline-block ${
                isActive('/user-dashboard') ? 'font-semibold' : ''
              } ${scrolled ? 'hover:text-green-300' : 'hover:text-green-700'}`}
            >
              Profile
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout} 
              className={`transition-colors px-3 py-2 ${
                scrolled ? 'hover:text-green-300' : 'hover:text-green-700'
              }`}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden transition-colors ${
          scrolled ? 'bg-green-700 text-white' : 'bg-green-200 text-green-900'
        }`}>
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link 
                to="/home" 
                className={`block px-2 py-2 rounded ${
                  isActive('/home') ? 'font-semibold' : ''
                } ${scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'}`}
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/salons" 
                className={`block px-2 py-2 rounded ${
                  isActive('/salons') ? 'font-semibold' : ''
                } ${scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'}`}
                onClick={() => setMobileOpen(false)}
              >
                Salons
              </Link>
            </li>
            <li>
              <Link 
                to="/my-bookings" 
                className={`block px-2 py-2 rounded ${
                  isActive('/my-bookings') ? 'font-semibold' : ''
                } ${scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'}`}
                onClick={() => setMobileOpen(false)}
              >
                My Bookings
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`block px-2 py-2 rounded ${
                  isActive('/about') ? 'font-semibold' : ''
                } ${scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'}`}
                onClick={() => setMobileOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/user-dashboard" 
                className={`block px-2 py-2 rounded ${
                  isActive('/user-dashboard') ? 'font-semibold' : ''
                } ${scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'}`}
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                className={`block w-full text-left px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-green-600' : 'hover:bg-green-100'
                }`}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default UserNavBar;
