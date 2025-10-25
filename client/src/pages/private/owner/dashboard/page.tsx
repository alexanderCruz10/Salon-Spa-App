import { useUserStore } from '@/store/userStore'
import { authAPI } from '@/lib/api'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'

function OwnerDashboardPage() {
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Navigation Menu */}
      <nav className={`p-4 shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-indigo-900 text-white' 
          : 'bg-indigo-200 text-indigo-900'
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
              <Link to="/owner-dashboard" className={`transition-colors px-3 py-2 inline-block font-semibold ${
                scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'
              }`}>Dashboard</Link>
            </li>
            <li>
              <Link to="/owner/salons" className={`transition-colors px-3 py-2 inline-block ${
                scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'
              }`}>My Salons</Link>
            </li>
            <li>
              <Link to="/owner/appointments" className={`transition-colors px-3 py-2 inline-block ${
                scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'
              }`}>Appointments</Link>
            </li>
            <li>
              <Link to="/owner/analytics" className={`transition-colors px-3 py-2 inline-block ${
                scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'
              }`}>Analytics</Link>
            </li>
            <li>
              <button onClick={handleLogout} className={`transition-colors px-3 py-2 ${
                scrolled ? 'hover:text-indigo-300' : 'hover:text-indigo-700'
              }`}>Logout</button>
            </li>
          </ul>
        </div>

        {/* Mobile menu (collapsible) */}
        {mobileOpen && (
          <div className={`md:hidden transition-colors ${
            scrolled ? 'bg-indigo-800 text-white' : 'bg-indigo-300 text-indigo-900'
          }`}>
            <ul className="flex flex-col p-4 space-y-2">
              <li>
                <Link to="/owner-dashboard" className={`block px-2 py-2 rounded font-semibold ${
                  scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'
                }`}>Dashboard</Link>
              </li>
              <li>
                <Link to="/owner/salons" className={`block px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'
                }`}>My Salons</Link>
              </li>
              <li>
                <Link to="/owner/appointments" className={`block px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'
                }`}>Appointments</Link>
              </li>
              <li>
                <Link to="/owner/analytics" className={`block px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'
                }`}>Analytics</Link>
              </li>
              <li>
                <button onClick={handleLogout} className={`block w-full text-left px-2 py-2 rounded ${
                  scrolled ? 'hover:bg-indigo-700' : 'hover:bg-indigo-200'
                }`}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-900">Business Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your salons, track appointments, and grow your business</p>
          </div>
          
          {/* Owner Profile Section */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
              Welcome back, {user?.name || 'Owner'}! 👋
            </h2>
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-indigo-900">{user.name}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-purple-900">{user.email}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                  <p className="text-sm text-gray-600 mb-1">Account Type</p>
                  <p className="text-lg font-semibold text-pink-900 capitalize">{user.role}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Owner ID</p>
                  <p className="text-lg font-semibold text-blue-900 truncate">{user.id}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Loading owner information...</p>
            )}
          </div>

          {/* Business Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow border-t-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Salons</h3>
                  <p className="text-4xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-500 mt-2">Active locations</p>
                </div>
                <div className="text-5xl">🏢</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow border-t-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Appointments Today</h3>
                  <p className="text-4xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-500 mt-2">Scheduled bookings</p>
                </div>
                <div className="text-5xl">📅</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow border-t-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</h3>
                  <p className="text-4xl font-bold text-purple-600">$0</p>
                  <p className="text-sm text-gray-500 mt-2">This month's earnings</p>
                </div>
                <div className="text-5xl">💰</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow border-t-4 border-pink-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Customers</h3>
                  <p className="text-4xl font-bold text-pink-600">0</p>
                  <p className="text-sm text-gray-500 mt-2">Unique clients served</p>
                </div>
                <div className="text-5xl">👥</div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-indigo-900 mb-4">Recent Activity</h3>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-600 text-lg">No recent activity</p>
                <p className="text-gray-500 mt-2">Business activities will appear here</p>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-indigo-900 mb-4">Upcoming Appointments</h3>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-600 text-lg">No upcoming appointments</p>
                <p className="text-gray-500 mt-2">Your scheduled appointments will appear here</p>
              </div>
            </div>
          </div>

          {/* Business Management Actions */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6">
            <h3 className="text-2xl font-semibold text-indigo-900 mb-6">Business Management</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/addsalon" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                <span className="text-2xl">➕</span>
                <span>Add New Salon</span>
              </Link>
              <Link to="/view-appointments" className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                <span className="text-2xl">📅</span>
                <span>View Appointments</span>
              </Link>
              <Link to="/manage-services" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                <span className="text-2xl">✂️</span>
                <span>Manage Services</span>
              </Link>
              <Link to="/manage-staff" className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-6 py-4 rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                <span className="text-2xl">👨‍💼</span>
                <span>Manage Staff</span>
              </Link>
              <Link to="/view-analytics" className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                <span className="text-2xl">📊</span>
                <span>View Analytics</span>
              </Link>
              <Link to="/settings" className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                <span className="text-2xl">⚙️</span>
                <span>Settings</span>
              </Link>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h3 className="text-2xl font-semibold text-indigo-900 mb-6">Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-600 mb-1">Completed Appointments</p>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-yellow-600">-</p>
                <p className="text-xs text-gray-500 mt-1">Across all salons</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600 mb-1">Customer Satisfaction</p>
                <p className="text-3xl font-bold text-blue-600">-</p>
                <p className="text-xs text-gray-500 mt-1">Overall feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerDashboardPage
