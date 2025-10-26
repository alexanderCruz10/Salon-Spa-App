import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

function OwnerNavBar() {
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
      scrolled ? 'bg-indigo-900 text-white' : 'bg-indigo-200 text-indigo-900'
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-2xl font-bold">Zenpoint Owner Portal</h2>

        {/* Mobile toggle button */}
        <button
          className={`md:hidden p-2 rounded transition-colors ${
            scrolled ? 'bg-indigo-800' : 'bg-indigo-300'
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 mb-1 ${scrolled ? 'bg-white' : 'bg-indigo-900'}`} />
          <span className={`block w-6 h-0.5 mb-1 ${scrolled ? 'bg-white' : 'bg-indigo-900'}`} />
          <span className={`block w-6 h-0.5 ${scrolled ? 'bg-white' : 'bg-indigo-900'}`} />
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <Link 
              to="/owner-dashboard" 
              className={`transition-colors px-3 py-2 inline-block ${
                isActive('/owner-dashboard') ? 'font-semibold' : ''
              } ${scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/owner/salons" 
              className={`transition-colors px-3 py-2 inline-block ${
                isActive('/owner/salons') ? 'font-semibold' : ''
              } ${scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'}`}
            >
              My Salons
            </Link>
          </li>
          <li>
            <Link 
              to="/owner/appointments" 
              className={`transition-colors px-3 py-2 inline-block ${
                isActive('/owner/appointments') ? 'font-semibold' : ''
              } ${scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'}`}
            >
              Appointments
            </Link>
          </li>
          <li>
            <Link 
              to="/addsalon" 
              className={`transition-colors px-3 py-2 inline-block ${
                isActive('/addsalon') ? 'font-semibold' : ''
              } ${scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'}`}
            >
              Add Salon
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout} 
              className={`transition-colors px-3 py-2 ${
                scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'
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
          scrolled ? 'bg-indigo-800 text-white' : 'bg-indigo-300 text-indigo-900'
        }`}>
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link 
                to="/owner-dashboard" 
                className={`block px-2 py-2 rounded ${
                  isActive('/owner-dashboard') ? 'font-semibold' : ''
                } ${scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'}`}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/owner/salons" 
                className={`block px-2 py-2 rounded ${
                  isActive('/owner/salons') ? 'font-semibold' : ''
                } ${scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'}`}
                onClick={() => setMobileOpen(false)}
              >
                My Salons
              </Link>
            </li>
            <li>
              <Link 
                to="/owner/appointments" 
                className={`block px-2 py-2 rounded ${
                  isActive('/owner/appointments') ? 'font-semibold' : ''
                } ${scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'}`}
                onClick={() => setMobileOpen(false)}
              >
                Appointments
              </Link>
            </li>
            <li>
              <Link 
                to="/addsalon" 
                className={`block px-2 py-2 rounded ${
                  isActive('/addsalon') ? 'font-semibold' : ''
                } ${scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'}`}
                onClick={() => setMobileOpen(false)}
              >
                Add Salon
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                className={`block w-full text-left px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'
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

export default OwnerNavBar;
