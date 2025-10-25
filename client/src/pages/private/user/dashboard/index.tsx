import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom'
import UserNavBar from '@/components/UserNavBar'

function UserDashboardPage() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-700">
      {/* Navigation Menu */}
      <UserNavBar />

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-green-900">My Profile</h1>
          </div>
          
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">Welcome back, {user?.name || 'User'}!</h2>
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-green-900">{user.name}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-green-900">{user.email}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Account Type</p>
                  <p className="text-lg font-semibold text-green-900 capitalize">{user.role}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">User ID</p>
                  <p className="text-lg font-semibold text-green-900">{user.id}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Loading user information...</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">My Appointments</h3>
                  <p className="text-4xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-500 mt-1">Upcoming bookings</p>
                </div>
                <div className="text-5xl">📅</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Favorite Salons</h3>
                  <p className="text-4xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-500 mt-1">Saved locations</p>
                </div>
                <div className="text-5xl">❤️</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Visits</h3>
                  <p className="text-4xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-500 mt-1">Completed appointments</p>
                </div>
                <div className="text-5xl">✨</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 text-lg">No recent activity</p>
              <p className="text-gray-500 mt-2">Your appointments and bookings will appear here</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-semibold text-green-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate('/salons')}
                className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <span>🔍</span>
                Browse Salons
              </button>
              <button 
                onClick={() => navigate('/home')}
                className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <span>📅</span>
                Book Appointment
              </button>
              <button className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2">
                <span>📝</span>
                My Bookings
              </button>
              <button className="bg-gray-600 text-white px-6 py-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center gap-2">
                <span>⚙️</span>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboardPage;
